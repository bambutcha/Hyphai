import { LlmError, isLlmError } from './errors.js';
import type { OpenRouterChatMessage } from './history.js';
import { buildModelAttemptChain, getDefaultModelId } from './models.js';
import type { StreamChatEvent } from './types.js';
import { getOpenRouterConfig } from './openrouter.js';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const RETRYABLE_LLM_ERRORS = new Set(['LLM rate limited', 'LLM model not found', 'LLM empty response']);

interface StreamChunkJson {
  choices?: Array<{
    delta?: { content?: string | null; reasoning?: string | null };
  }>;
  error?: { message?: string };
}

async function* streamOpenRouterOnce(
  messages: OpenRouterChatMessage[],
  model: string,
): AsyncGenerator<string> {
  const { apiKey, timeoutMs, appUrl } = getOpenRouterConfig();
  if (!apiKey) throw new LlmError(503, 'LLM not configured');

  const response = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': appUrl,
      'X-Title': 'Hyphai',
    },
    body: JSON.stringify({
      model,
      messages,
      stream: true,
      temperature: 0.6,
      max_tokens: 2048,
    }),
    signal: AbortSignal.timeout(timeoutMs),
  });

  if (!response.ok) {
    let detail = response.statusText;
    try {
      const errBody = (await response.json()) as StreamChunkJson;
      detail = errBody.error?.message ?? detail;
    } catch {
      /* ignore */
    }
    if (response.status === 401) throw new LlmError(503, 'LLM not configured');
    if (response.status === 404) throw new LlmError(502, 'LLM model not found');
    if (response.status === 429) throw new LlmError(502, 'LLM rate limited');
    console.error('[openrouter stream]', model, response.status, detail);
    throw new LlmError(502, 'LLM unavailable');
  }

  const reader = response.body?.getReader();
  if (!reader) throw new LlmError(502, 'LLM unavailable');

  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith('data:')) continue;
      const payload = trimmed.slice(5).trim();
      if (!payload || payload === '[DONE]') continue;

      try {
        const json = JSON.parse(payload) as StreamChunkJson;
        const delta = json.choices?.[0]?.delta;
        const piece = delta?.content ?? delta?.reasoning;
        if (piece) yield piece;
      } catch {
        /* skip malformed chunk */
      }
    }
  }
}

export async function* streamChat(
  messages: OpenRouterChatMessage[],
  modelId?: string,
): AsyncGenerator<StreamChatEvent> {
  const requestedModel = modelId?.trim() || getDefaultModelId();
  const chain = buildModelAttemptChain(requestedModel);
  let lastError: LlmError | null = null;

  for (const model of chain) {
    try {
      let full = '';
      for await (const delta of streamOpenRouterOnce(messages, model)) {
        full += delta;
        yield { kind: 'delta', text: delta };
      }

      if (!full.trim()) {
        throw new LlmError(502, 'LLM empty response');
      }

      if (model !== requestedModel) {
        console.info('[openrouter stream] fallback', requestedModel, '->', model);
      }

      yield {
        kind: 'complete',
        text: full.trim(),
        meta: {
          modelUsed: model,
          requestedModel,
          usedFallback: model !== requestedModel,
        },
      };
      return;
    } catch (err) {
      if (!isLlmError(err)) throw err;
      lastError = err;
      if (RETRYABLE_LLM_ERRORS.has(err.message)) continue;
      throw err;
    }
  }

  throw lastError ?? new LlmError(502, 'LLM unavailable');
}

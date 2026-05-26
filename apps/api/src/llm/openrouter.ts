import { LlmError, isLlmError } from './errors.js';
import type { OpenRouterChatMessage } from './history.js';
import { buildModelAttemptChain, getDefaultModelId } from './models.js';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

const RETRYABLE_LLM_ERRORS = new Set(['LLM rate limited', 'LLM model not found', 'LLM empty response']);

interface OpenRouterMessage {
  content?: string | null;
  reasoning?: string | null;
}

interface OpenRouterResponse {
  choices?: Array<{ message?: OpenRouterMessage }>;
  error?: { message?: string; code?: number };
}

function extractAssistantText(message: OpenRouterMessage | undefined): string | null {
  if (!message) return null;

  const content = message.content?.trim();
  if (content) return content;

  const reasoning = message.reasoning?.trim();
  if (!reasoning || reasoning.length < 8) return null;

  if (/[\u0400-\u04FF]/.test(reasoning) && reasoning.length >= 12) {
    return reasoning.slice(0, 4000);
  }

  return null;
}

export function getOpenRouterConfig() {
  return {
    apiKey: process.env.OPENROUTER_API_KEY?.trim() ?? '',
    timeoutMs: Number(process.env.OPENROUTER_TIMEOUT_MS ?? 60_000),
    appUrl: process.env.OPENROUTER_APP_URL?.trim() || 'http://localhost:3000',
  };
}

async function requestChatOnce(
  messages: OpenRouterChatMessage[],
  model: string,
): Promise<string> {
  const { apiKey, timeoutMs, appUrl } = getOpenRouterConfig();

  if (!apiKey) {
    throw new LlmError(503, 'LLM not configured');
  }

  let response: Response;
  try {
    response = await fetch(OPENROUTER_URL, {
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
        temperature: 0.6,
        max_tokens: 2048,
      }),
      signal: AbortSignal.timeout(timeoutMs),
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === 'TimeoutError') {
      throw new LlmError(504, 'LLM timeout');
    }
    throw new LlmError(502, 'LLM unavailable');
  }

  let data: OpenRouterResponse;
  try {
    data = (await response.json()) as OpenRouterResponse;
  } catch {
    throw new LlmError(502, 'LLM unavailable');
  }

  if (response.status === 401) {
    throw new LlmError(503, 'LLM not configured');
  }

  if (response.status === 404) {
    throw new LlmError(502, 'LLM model not found');
  }

  if (response.status === 429) {
    const detail = data.error?.message ?? 'rate limited';
    console.warn('[openrouter]', model, '429', detail);
    throw new LlmError(502, 'LLM rate limited');
  }

  if (!response.ok) {
    const detail = data.error?.message?.slice(0, 120);
    console.error('[openrouter]', model, response.status, detail ?? response.statusText);
    throw new LlmError(502, 'LLM unavailable');
  }

  const content = extractAssistantText(data.choices?.[0]?.message);
  if (!content) {
    console.warn('[openrouter]', model, 'empty content/reasoning');
    throw new LlmError(502, 'LLM empty response');
  }

  return content;
}

export interface ChatCompletionResult {
  text: string;
  modelUsed: string;
  requestedModel: string;
  usedFallback: boolean;
}

export async function completeChat(
  messages: OpenRouterChatMessage[],
  modelId?: string,
): Promise<ChatCompletionResult> {
  const requestedModel = modelId?.trim() || getDefaultModelId();
  const chain = buildModelAttemptChain(requestedModel);

  let lastError: LlmError | null = null;

  for (const model of chain) {
    try {
      const text = await requestChatOnce(messages, model);
      if (model !== requestedModel) {
        console.info('[openrouter] used fallback', requestedModel, '->', model);
      }
      return {
        text,
        modelUsed: model,
        requestedModel,
        usedFallback: model !== requestedModel,
      };
    } catch (err) {
      if (!isLlmError(err)) throw err;
      lastError = err;
      if (RETRYABLE_LLM_ERRORS.has(err.message)) {
        continue;
      }
      throw err;
    }
  }

  throw lastError ?? new LlmError(502, 'LLM unavailable');
}

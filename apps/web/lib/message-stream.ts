import { getAuthToken } from './auth';
import type { Message } from './api';
import { ApiError, parseApiError } from './api';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export interface StreamDonePayload {
  assistant: Message;
  modelUsed: string;
  requestedModel: string;
  usedFallback: boolean;
}

export interface SendMessageStreamHandlers {
  onUserMessage: (message: Message) => void;
  onChunk: (delta: string) => void;
  onDone: (payload: StreamDonePayload) => void;
  onError: (message: string) => void;
}

function parseSseBlock(
  block: string,
  handlers: SendMessageStreamHandlers,
): boolean {
  let event = 'message';
  const dataLines: string[] = [];

  for (const line of block.split('\n')) {
    if (line.startsWith('event:')) event = line.slice(6).trim();
    else if (line.startsWith('data:')) dataLines.push(line.slice(5).trim());
  }

  if (dataLines.length === 0) return false;

  const dataStr = dataLines.join('\n');
  try {
    if (event === 'user_message') {
      handlers.onUserMessage(JSON.parse(dataStr) as Message);
      return false;
    }
    if (event === 'chunk') {
      const { delta } = JSON.parse(dataStr) as { delta: string };
      if (delta) handlers.onChunk(delta);
      return false;
    }
    if (event === 'done') {
      handlers.onDone(JSON.parse(dataStr) as StreamDonePayload);
      return true;
    }
    if (event === 'error') {
      const { error } = JSON.parse(dataStr) as { error: string };
      handlers.onError(error);
      return true;
    }
  } catch {
    /* ignore malformed */
  }
  return false;
}

export async function sendMessageStream(
  conversationId: string,
  content: string,
  model: string | undefined,
  handlers: SendMessageStreamHandlers,
): Promise<void> {
  const token = getAuthToken();
  let res: Response;

  try {
    res = await fetch(`${API_URL}/api/conversations/${conversationId}/messages/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/event-stream',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ content, ...(model ? { model } : {}) }),
    });
  } catch {
    throw new ApiError(0, 'Cannot reach server. Check your connection.');
  }

  if (!res.ok) {
    const body = await res.text();
    throw parseApiError(res.status, body || res.statusText);
  }

  const reader = res.body?.getReader();
  if (!reader) {
    handlers.onError('LLM unavailable');
    return;
  }

  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    let boundary = buffer.indexOf('\n\n');
    while (boundary !== -1) {
      const block = buffer.slice(0, boundary);
      buffer = buffer.slice(boundary + 2);
      if (parseSseBlock(block, handlers)) return;
      boundary = buffer.indexOf('\n\n');
    }
  }

  if (buffer.trim()) {
    parseSseBlock(buffer, handlers);
  }
}

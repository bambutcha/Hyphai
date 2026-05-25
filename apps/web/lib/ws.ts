import type { Message } from '@/lib/api';
import { getAuthToken, getWsUrl } from '@/lib/auth';

export type WsEvent =
  | { type: 'connected'; conversationId: string }
  | { type: 'messages.created'; conversationId: string; messages: Message[] };

export type WsConnectionStatus = 'connecting' | 'connected' | 'disconnected';

interface ConnectOptions {
  onConnectionChange?: (status: WsConnectionStatus) => void;
}

export function connectConversationWs(
  conversationId: string,
  onEvent: (event: WsEvent) => void,
  options?: ConnectOptions,
): () => void {
  const token = getAuthToken();
  if (!token) return () => {};

  const url = `${getWsUrl()}/ws?token=${encodeURIComponent(token)}&conversationId=${encodeURIComponent(conversationId)}`;
  const ws = new WebSocket(url);

  options?.onConnectionChange?.('connecting');

  ws.onopen = () => {
    options?.onConnectionChange?.('connected');
  };

  ws.onclose = () => {
    options?.onConnectionChange?.('disconnected');
  };

  ws.onerror = () => {
    options?.onConnectionChange?.('disconnected');
  };

  ws.onmessage = (event) => {
    try {
      onEvent(JSON.parse(event.data) as WsEvent);
    } catch {
      /* ignore */
    }
  };

  return () => ws.close();
}

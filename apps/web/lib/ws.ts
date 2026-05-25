import type { Message } from '@/lib/api';
import { getAuthToken, getWsUrl } from '@/lib/auth';

export type WsEvent =
  | { type: 'connected'; conversationId: string }
  | { type: 'messages.created'; conversationId: string; messages: Message[] };

export function connectConversationWs(
  conversationId: string,
  onEvent: (event: WsEvent) => void,
): () => void {
  const token = getAuthToken();
  if (!token) return () => {};

  const url = `${getWsUrl()}/ws?token=${encodeURIComponent(token)}&conversationId=${encodeURIComponent(conversationId)}`;
  const ws = new WebSocket(url);

  ws.onmessage = (event) => {
    try {
      onEvent(JSON.parse(event.data) as WsEvent);
    } catch {
      /* ignore */
    }
  };

  return () => ws.close();
}

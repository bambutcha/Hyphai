import type { MessageRole } from '../db/schema.js';
import { HYPHAI_SYSTEM_PROMPT } from './prompt.js';

export const MAX_HISTORY_MESSAGES = 20;

export interface ChatTurn {
  role: MessageRole;
  content: string;
}

export interface OpenRouterChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export function buildOpenRouterMessages(rows: ChatTurn[]): OpenRouterChatMessage[] {
  const chatRoles = rows.filter(
    (row): row is ChatTurn & { role: 'user' | 'assistant' } =>
      row.role === 'user' || row.role === 'assistant',
  );

  const recent = chatRoles.slice(-MAX_HISTORY_MESSAGES);

  return [
    { role: 'system', content: HYPHAI_SYSTEM_PROMPT },
    ...recent.map((row) => ({
      role: row.role,
      content: row.content,
    })),
  ];
}

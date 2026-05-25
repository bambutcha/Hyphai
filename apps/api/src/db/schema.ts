import type { ColumnType, Generated } from 'kysely';

export type MessageRole = 'user' | 'assistant' | 'system';

export interface ConversationsTable {
  id: Generated<string>;
  title: string;
  created_at: ColumnType<Date, Date | string | undefined, never>;
  updated_at: ColumnType<Date, Date | string | undefined, Date | string>;
}

export interface MessagesTable {
  id: Generated<string>;
  conversation_id: string;
  role: MessageRole;
  content: string;
  created_at: ColumnType<Date, Date | string | undefined, never>;
}

export interface DB {
  conversations: ConversationsTable;
  messages: MessagesTable;
}

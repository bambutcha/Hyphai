import type { ColumnType, Generated } from 'kysely';

export type MessageRole = 'user' | 'assistant' | 'system';

export interface UsersTable {
  id: Generated<string>;
  email: string;
  password_hash: string;
  display_name: string;
  created_at: ColumnType<Date, Date | string | undefined, never>;
}

export interface ConversationsTable {
  id: Generated<string>;
  user_id: string;
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
  users: UsersTable;
  conversations: ConversationsTable;
  messages: MessagesTable;
}

export interface LlmStreamMeta {
  modelUsed: string;
  requestedModel: string;
  usedFallback: boolean;
}

export type StreamChatEvent =
  | { kind: 'delta'; text: string }
  | { kind: 'complete'; text: string; meta: LlmStreamMeta };

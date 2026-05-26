const STORAGE_KEY = 'hyphai-llm-model';

export const DEFAULT_LLM_MODEL_ID = 'openai/gpt-oss-120b:free';

export function getStoredLlmModel(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(STORAGE_KEY);
}

export function setStoredLlmModel(modelId: string): void {
  localStorage.setItem(STORAGE_KEY, modelId);
}

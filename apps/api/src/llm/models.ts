export interface LlmModelOption {
  id: string;
  label: string;
  description: string;
}

/** Модели в UI. На free tier многие дают 429 — API автоматически пробует fallback-цепочку. */
export const FREE_LLM_MODELS: LlmModelOption[] = [
  {
    id: 'openai/gpt-oss-120b:free',
    label: 'GPT-OSS 120B',
    description: 'Самая стабильная на free tier',
  },
  {
    id: 'google/gemma-4-26b-a4b-it:free',
    label: 'Gemma 4 26B',
    description: 'Google; при 429 API переключится на запасную',
  },
  {
    id: 'deepseek/deepseek-v4-flash:free',
    label: 'DeepSeek V4 Flash',
    description: 'DeepSeek; при 429 API переключится на запасную',
  },
  {
    id: 'qwen/qwen3-next-80b-a3b-instruct:free',
    label: 'Qwen3 Next 80B',
    description: 'Qwen instruct; при 429 API переключится на запасную',
  },
  {
    id: 'meta-llama/llama-3.3-70b-instruct:free',
    label: 'Llama 3.3 70B',
    description: 'Meta instruct; при 429 API переключится на запасную',
  },
  {
    id: 'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free',
    label: 'Nemotron 3 Nano',
    description: 'NVIDIA reasoning',
  },
  {
    id: 'liquid/lfm-2.5-1.2b-instruct:free',
    label: 'Liquid LFM 2.5',
    description: 'Компактная, часто доступна при 429 у крупных',
  },
  {
    id: 'openrouter/free',
    label: 'Авто (free router)',
    description: 'Случайная free-модель',
  },
];

const ALLOWED_IDS = new Set(FREE_LLM_MODELS.map((m) => m.id));

/** Цепочка при 429 / 404 у выбранной модели */
export const LLM_FALLBACK_CHAIN = [
  'openai/gpt-oss-120b:free',
  'liquid/lfm-2.5-1.2b-instruct:free',
] as const;

export const FALLBACK_MODEL_ID = LLM_FALLBACK_CHAIN[0];

export function getDefaultModelId(): string {
  const fromEnv = process.env.OPENROUTER_MODEL?.trim();
  if (fromEnv && ALLOWED_IDS.has(fromEnv)) return fromEnv;
  return FALLBACK_MODEL_ID;
}

export function resolveModelId(requested?: string | null): string {
  const trimmed = requested?.trim();
  if (trimmed && ALLOWED_IDS.has(trimmed)) return trimmed;
  return getDefaultModelId();
}

export function buildModelAttemptChain(primaryModelId: string): string[] {
  const chain: string[] = [primaryModelId];
  for (const fallback of LLM_FALLBACK_CHAIN) {
    if (!chain.includes(fallback)) chain.push(fallback);
  }
  return chain;
}

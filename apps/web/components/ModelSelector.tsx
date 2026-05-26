'use client';

import type { LlmModelOption } from '@/lib/api';
import { uiText } from '@/lib/ui-text';

interface ModelSelectorProps {
  models: LlmModelOption[];
  value: string;
  disabled?: boolean;
  onChange: (modelId: string) => void;
}

export function ModelSelector({ models, value, disabled, onChange }: ModelSelectorProps) {
  const selected = models.find((m) => m.id === value);

  return (
    <label className="flex w-full shrink-0 flex-col items-start gap-0.5 md:w-auto md:items-end">
      <span className="text-[10px] uppercase tracking-wider text-zinc-500">
        {uiText.messages.modelLabel}
      </span>
      <select
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        title={selected?.description}
        className="hyphai-focus hyphai-interactive w-full max-w-full cursor-pointer rounded-lg border border-[var(--hyphai-border)] bg-zinc-950/80 px-2.5 py-1.5 text-xs text-zinc-200 disabled:cursor-not-allowed disabled:opacity-50 md:w-auto md:max-w-[11rem]"
      >
        {models.map((model) => (
          <option key={model.id} value={model.id}>
            {model.label}
          </option>
        ))}
      </select>
    </label>
  );
}

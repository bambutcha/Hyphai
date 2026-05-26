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
    <label className="flex shrink-0 flex-col items-end gap-0.5">
      <span className="text-[10px] uppercase tracking-wider text-zinc-500">
        {uiText.messages.modelLabel}
      </span>
      <select
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        title={selected?.description}
        className="hyphai-focus hyphai-interactive max-w-[11rem] cursor-pointer rounded-lg border border-[var(--hyphai-border)] bg-zinc-950/80 px-2.5 py-1.5 text-xs text-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
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

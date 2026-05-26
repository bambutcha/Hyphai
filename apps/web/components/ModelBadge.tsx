'use client';

import type { LlmModelOption } from '@/lib/api';
import { uiText } from '@/lib/ui-text';

export interface ModelMeta {
  modelUsed: string;
  requestedModel: string;
  usedFallback: boolean;
}

interface ModelBadgeProps {
  meta: ModelMeta | null;
  models: LlmModelOption[];
}

function labelForModel(id: string, models: LlmModelOption[]): string {
  return models.find((m) => m.id === id)?.label ?? id.split('/').pop()?.replace(':free', '') ?? id;
}

export function ModelBadge({ meta, models }: ModelBadgeProps) {
  if (!meta) return null;

  const usedLabel = labelForModel(meta.modelUsed, models);
  const requestedLabel = labelForModel(meta.requestedModel, models);

  if (!meta.usedFallback) {
    return (
      <span className="text-xs text-zinc-500" title={meta.modelUsed}>
        {uiText.model.badgeLabel(usedLabel)}
      </span>
    );
  }

  return (
    <span
      className="rounded-md bg-amber-950/60 px-2 py-0.5 text-xs text-amber-200/90 ring-1 ring-amber-600/30"
      title={`${meta.requestedModel} → ${meta.modelUsed}`}
    >
      {uiText.model.fallbackBadge(requestedLabel, usedLabel)}
    </span>
  );
}

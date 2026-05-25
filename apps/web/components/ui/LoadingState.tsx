'use client';

interface LoadingStateProps {
  label?: string;
  compact?: boolean;
}

export function LoadingState({ label = 'Loading…', compact = false }: LoadingStateProps) {
  return (
    <div
      className={`flex items-center justify-center gap-2 text-sm text-zinc-500 ${
        compact ? 'py-4' : 'py-12'
      }`}
    >
      <span
        className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-zinc-600 border-t-emerald-500"
        aria-hidden
      />
      <span>{label}</span>
    </div>
  );
}

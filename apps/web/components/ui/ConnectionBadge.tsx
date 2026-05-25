'use client';

export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected';

interface ConnectionBadgeProps {
  status: ConnectionStatus;
}

const labels: Record<ConnectionStatus, string> = {
  connecting: 'Подключение…',
  connected: 'Подключено',
  disconnected: 'Отключено',
};

const dotColors: Record<ConnectionStatus, string> = {
  connecting: 'bg-amber-400 animate-pulse',
  connected: 'bg-emerald-500',
  disconnected: 'bg-red-500',
};

export function ConnectionBadge({ status }: ConnectionBadgeProps) {
  if (status === 'connected') return null;

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-800/80 px-2.5 py-0.5 text-xs text-zinc-400 ring-1 ring-zinc-700">
      <span className={`h-1.5 w-1.5 rounded-full ${dotColors[status]}`} aria-hidden />
      {labels[status]}
    </span>
  );
}

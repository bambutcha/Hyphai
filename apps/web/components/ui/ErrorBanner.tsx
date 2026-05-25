'use client';

interface ErrorBannerProps {
  message: string;
  onDismiss: () => void;
  onRetry?: () => void;
}

export function ErrorBanner({ message, onDismiss, onRetry }: ErrorBannerProps) {
  return (
    <div className="flex items-center justify-center gap-3 bg-red-950/80 px-4 py-2 text-sm text-red-200" role="alert">
      <span className="flex-1 text-center">{message}</span>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="hyphai-interactive hyphai-focus shrink-0 rounded-md bg-red-900/60 px-2.5 py-2 text-xs font-medium text-red-100 hover:bg-red-900"
        >
          Повторить
        </button>
      )}
      <button
        type="button"
        onClick={onDismiss}
        className="hyphai-interactive hyphai-focus shrink-0 rounded-md px-2.5 py-2 text-xs text-red-300 hover:bg-red-900/40 hover:text-red-100"
        aria-label="Закрыть"
        title="Закрыть"
      >
        ✕
      </button>
    </div>
  );
}

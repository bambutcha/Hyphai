'use client';

import { useEffect, useRef } from 'react';
import type { Message } from '@/lib/api';
import { ConnectionBadge, type ConnectionStatus } from '@/components/ui/ConnectionBadge';
import { LoadingState } from '@/components/ui/LoadingState';
import { uiText } from '@/lib/ui-text';

interface MessagePaneProps {
  messages: Message[];
  conversationTitle: string;
  draft: string;
  loading?: boolean;
  loadError?: string | null;
  onRetryLoad?: () => void;
  connectionStatus?: ConnectionStatus | null;
  onDraftChange: (value: string) => void;
  onSend: () => void;
  sending: boolean;
}

export function MessagePane({
  messages,
  conversationTitle,
  draft,
  loading = false,
  loadError = null,
  onRetryLoad,
  connectionStatus = null,
  onDraftChange,
  onSend,
  sending,
}: MessagePaneProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim() || sending) return;
    onSend();
  };

  return (
    <section className="chat-area-bg flex h-full min-h-0 flex-1 flex-col">
      <header className="flex items-center justify-between gap-3 border-b border-emerald-900/30 bg-zinc-900/50 px-6 py-4 backdrop-blur-sm">
        <h2 className="truncate text-lg font-medium text-zinc-100">{conversationTitle}</h2>
        {connectionStatus && <ConnectionBadge status={connectionStatus} />}
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8">
        {loading && <LoadingState label={uiText.messages.loadingMessages} />}
        {!loading && loadError && (
          <div className="mx-auto max-w-3xl py-12 text-center">
            <p className="text-sm text-red-400">{loadError}</p>
            {onRetryLoad && (
              <button
                type="button"
                onClick={onRetryLoad}
                className="mt-3 rounded-lg bg-zinc-800 px-4 py-2 text-sm text-zinc-200 transition hover:bg-zinc-700"
              >
                {uiText.messages.retry}
              </button>
            )}
          </div>
        )}
        {!loading && !loadError && (
          <div className="mx-auto flex max-w-3xl flex-col gap-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`animate-hyphae-message-in flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-md ${
                    message.role === 'user'
                      ? 'bg-emerald-600 text-white shadow-emerald-900/30'
                      : 'bg-zinc-800/90 text-zinc-100 ring-1 ring-zinc-700/80'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="border-t border-emerald-900/30 bg-zinc-900/60 p-4 backdrop-blur-sm md:p-6"
      >
        <div className="mx-auto flex max-w-3xl gap-3">
          <input
            type="text"
            value={draft}
            onChange={(e) => onDraftChange(e.target.value)}
            placeholder={uiText.messages.placeholder}
            disabled={sending}
            className="flex-1 rounded-xl border border-zinc-700 bg-zinc-950/80 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 transition focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!draft.trim() || sending}
            className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-medium text-white shadow-md shadow-emerald-900/25 transition hover:scale-[1.02] hover:bg-emerald-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
          >
            {sending ? '…' : uiText.messages.send}
          </button>
        </div>
      </form>
    </section>
  );
}

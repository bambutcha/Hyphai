'use client';

import { useEffect, useRef } from 'react';
import type { Message } from '@/lib/api';
import { ConnectionBadge, type ConnectionStatus } from '@/components/ui/ConnectionBadge';
import { LoadingState } from '@/components/ui/LoadingState';

interface MessagePaneProps {
  messages: Message[];
  conversationTitle: string | null;
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
    <section className="flex h-full min-h-0 flex-1 flex-col bg-zinc-900">
      <header className="flex items-center justify-between gap-3 border-b border-emerald-900/30 px-6 py-4">
        <h2 className="text-lg font-medium text-zinc-100">
          {conversationTitle ?? 'Select a conversation'}
        </h2>
        {conversationTitle && connectionStatus && (
          <ConnectionBadge status={connectionStatus} />
        )}
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8">
        {!conversationTitle && (
          <p className="text-center text-sm text-zinc-500">
            Create or select a chat to start messaging
          </p>
        )}
        {conversationTitle && loading && <LoadingState label="Загрузка сообщений…" />}
        {conversationTitle && !loading && loadError && (
          <div className="mx-auto max-w-3xl py-12 text-center">
            <p className="text-sm text-red-400">{loadError}</p>
            {onRetryLoad && (
              <button
                type="button"
                onClick={onRetryLoad}
                className="mt-3 rounded-lg bg-zinc-800 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-700"
              >
                Повторить
              </button>
            )}
          </div>
        )}
        {conversationTitle && !loading && !loadError && (
          <div className="mx-auto flex max-w-3xl flex-col gap-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    message.role === 'user'
                      ? 'bg-emerald-700 text-white'
                      : 'bg-zinc-800 text-zinc-100 ring-1 ring-zinc-700'
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

      <form onSubmit={handleSubmit} className="border-t border-emerald-900/30 p-4 md:p-6">
        <div className="mx-auto flex max-w-3xl gap-3">
          <input
            type="text"
            value={draft}
            onChange={(e) => onDraftChange(e.target.value)}
            placeholder={conversationTitle ? 'Type a message…' : 'Select a chat first'}
            disabled={!conversationTitle || sending}
            className="flex-1 rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!conversationTitle || !draft.trim() || sending}
            className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </form>
    </section>
  );
}

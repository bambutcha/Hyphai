'use client';

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect, useRef } from 'react';
import type { Message } from '@/lib/api';
import { ConnectionBadge, type ConnectionStatus } from '@/components/ui/ConnectionBadge';
import { LoadingState } from '@/components/ui/LoadingState';
import { GlowButton } from '@/components/visual/GlowButton';
import { messageBubble, motionTransition } from '@/lib/motion';
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
  const reduced = useReducedMotion();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
  }, [messages, reduced]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim() || sending) return;
    onSend();
  };

  return (
    <section className="chat-main-area relative flex h-full min-h-0 flex-1 flex-col">
      <header className="glass-panel z-10 mx-4 mt-4 flex items-center justify-between gap-3 rounded-xl border-0 px-6 py-4 md:mx-6">
        <h2 className="font-display truncate text-lg font-semibold text-zinc-100">
          {conversationTitle}
        </h2>
        {connectionStatus && <ConnectionBadge status={connectionStatus} />}
      </header>

      <div className="scroll-fade-y flex-1 overflow-y-auto px-4 py-6 md:px-8">
        {loading && <LoadingState label={uiText.messages.loadingMessages} />}
        {!loading && loadError && (
          <div className="mx-auto max-w-3xl py-12 text-center">
            <p className="text-sm text-red-400">{loadError}</p>
            {onRetryLoad && (
              <button
                type="button"
                onClick={onRetryLoad}
                className="hyphai-interactive hyphai-focus mt-3 rounded-lg bg-zinc-800/80 px-4 py-2.5 text-sm text-zinc-200 hover:bg-zinc-700"
              >
                {uiText.messages.retry}
              </button>
            )}
          </div>
        )}
        {!loading && !loadError && (
          <div className="mx-auto flex max-w-3xl flex-col gap-4">
            <AnimatePresence initial={false}>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  layout={!reduced}
                  variants={messageBubble}
                  initial="hidden"
                  animate="visible"
                  transition={motionTransition(!!reduced)}
                  className={`flex ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      message.role === 'user'
                        ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-emerald-950 shadow-[0_4px_24px_rgba(52,211,153,0.25)]'
                        : 'glass-panel text-zinc-100 shadow-lg shadow-black/20'
                    }`}
                  >
                    {message.content}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {sending && (
              <motion.div
                initial={reduced ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
                aria-live="polite"
              >
                <div className="glass-panel flex items-center gap-2 rounded-2xl px-4 py-3">
                  <span className="flex gap-1" aria-hidden>
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-glow-pulse"
                        style={{ animationDelay: `${i * 0.2}s` }}
                      />
                    ))}
                  </span>
                  <span className="text-xs text-zinc-500">Отправка…</span>
                </div>
              </motion.div>
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="relative z-10 px-4 pb-6 pt-2 md:px-8 md:pb-8">
        <div className="composer-glow glass-panel mx-auto flex max-w-3xl gap-3 rounded-2xl p-2 transition-shadow">
          <input
            type="text"
            value={draft}
            onChange={(e) => onDraftChange(e.target.value)}
            placeholder={uiText.messages.placeholder}
            disabled={sending}
            className="hyphai-focus flex-1 bg-transparent px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 disabled:cursor-not-allowed disabled:opacity-50"
          />
          <GlowButton
            type="submit"
            disabled={!draft.trim() || sending}
            className="shrink-0 px-5"
          >
            {sending ? (
              <span className="inline-flex items-center gap-2">
                <span className="h-3 w-3 animate-spin rounded-full border-2 border-emerald-950/30 border-t-emerald-950" />
                …
              </span>
            ) : (
              uiText.messages.send
            )}
          </GlowButton>
        </div>
      </form>
    </section>
  );
}

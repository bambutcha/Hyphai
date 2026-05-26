'use client';

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect, useRef } from 'react';
import { MessageMarkdown } from '@/components/MessageMarkdown';
import { ModelSelector } from '@/components/ModelSelector';
import type { LlmModelOption, Message } from '@/lib/api';
import { ModelBadge, type ModelMeta } from '@/components/ModelBadge';
import { ConnectionBadge, type ConnectionStatus } from '@/components/ui/ConnectionBadge';
import { MessageListSkeleton } from '@/components/ui/MessageListSkeleton';
import { useToast } from '@/components/ui/ToastProvider';
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
  llmModels?: LlmModelOption[];
  selectedModelId?: string;
  onModelChange?: (modelId: string) => void;
  onDraftChange: (value: string) => void;
  onSend: () => void;
  sending: boolean;
  streamingContent?: string | null;
  onOpenMenu?: () => void;
  lastModelMeta?: ModelMeta | null;
  onForkMessage?: (messageId: string) => void;
  onShare?: () => void;
}

export function MessagePane({
  messages,
  conversationTitle,
  draft,
  loading = false,
  loadError = null,
  onRetryLoad,
  connectionStatus = null,
  llmModels = [],
  selectedModelId = '',
  onModelChange,
  onDraftChange,
  onSend,
  sending,
  streamingContent = null,
  onOpenMenu,
  lastModelMeta = null,
  onForkMessage,
  onShare,
}: MessagePaneProps) {
  const reduced = useReducedMotion();
  const toast = useToast();
  const bottomRef = useRef<HTMLDivElement>(null);

  const copyMessage = async (content: string) => {
    try {
      if (!navigator.clipboard?.writeText) {
        toast.error(uiText.copy.failed);
        return;
      }
      await navigator.clipboard.writeText(content);
      toast.success(uiText.copy.success);
    } catch {
      toast.error(uiText.copy.failed);
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
  }, [messages, streamingContent, reduced]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim() || sending) return;
    onSend();
  };

  return (
    <section className="chat-main-area relative flex h-full min-h-0 flex-1 flex-col">
      <header className="glass-panel z-10 mx-4 mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border-0 px-4 py-4 md:mx-6 md:px-6">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          {onOpenMenu && (
            <button
              type="button"
              onClick={onOpenMenu}
              aria-label={uiText.shell.openMenu}
              className="hyphai-focus hyphai-interactive shrink-0 rounded-lg p-2 text-zinc-300 hover:bg-zinc-800/80 md:hidden"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M4 7h16M4 12h16M4 17h16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          )}
          <h2 className="font-display min-w-0 flex-1 truncate text-lg font-semibold text-zinc-100">
            {conversationTitle}
          </h2>
        </div>
        <div className="flex items-center gap-3">
          {llmModels.length > 0 && selectedModelId && onModelChange && (
            <ModelSelector
              models={llmModels}
              value={selectedModelId}
              disabled={sending}
              onChange={onModelChange}
            />
          )}
          {onShare && (
            <button
              type="button"
              onClick={onShare}
              className="hyphai-interactive hyphai-focus rounded-lg px-2 py-1 text-xs text-zinc-400 hover:bg-zinc-800/80 hover:text-emerald-400"
            >
              {uiText.share.enable}
            </button>
          )}
          {connectionStatus && <ConnectionBadge status={connectionStatus} />}
          <ModelBadge meta={lastModelMeta} models={llmModels} />
        </div>
      </header>

      <div className="scroll-fade-y flex-1 overflow-y-auto px-4 py-6 md:px-8">
        {loading && <MessageListSkeleton count={4} />}
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
                    className={`group/bubble relative max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      message.role === 'user'
                        ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-emerald-950 shadow-[0_4px_24px_rgba(52,211,153,0.25)]'
                        : 'glass-panel text-zinc-100 shadow-lg shadow-black/20'
                    }`}
                  >
                    <div className="absolute -top-2 right-2 flex gap-1 opacity-100 transition sm:opacity-0 sm:group-hover/bubble:opacity-100 sm:group-focus-within/bubble:opacity-100">
                      <button
                        type="button"
                        onClick={() => void copyMessage(message.content)}
                        aria-label={uiText.copy.aria}
                        title={uiText.copy.action}
                        className="hyphai-interactive hyphai-focus flex min-h-9 min-w-9 items-center justify-center rounded-md bg-zinc-900/90 px-2 text-[10px] text-zinc-400 ring-1 ring-zinc-700 hover:text-emerald-400 sm:min-h-0 sm:min-w-0 sm:py-0.5"
                      >
                        {uiText.copy.action}
                      </button>
                      {onForkMessage && (
                        <button
                          type="button"
                          onClick={() => onForkMessage(message.id)}
                          aria-label={uiText.fork.action}
                          title={uiText.fork.action}
                          className="hyphai-interactive hyphai-focus flex min-h-9 min-w-9 items-center justify-center rounded-md bg-zinc-900/90 px-2 text-[10px] text-zinc-400 ring-1 ring-zinc-700 hover:text-emerald-400 sm:min-h-0 sm:min-w-0 sm:py-0.5"
                        >
                          {uiText.fork.action}
                        </button>
                      )}
                    </div>
                    {message.role === 'assistant' ? (
                      <MessageMarkdown content={message.content} />
                    ) : (
                      message.content
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {streamingContent !== null && (
              <motion.div
                initial={reduced ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
                aria-live="polite"
              >
                <div className="glass-panel max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed text-zinc-100 shadow-lg shadow-black/20">
                  <MessageMarkdown content={streamingContent} />
                </div>
              </motion.div>
            )}
            {sending && streamingContent === null && (
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

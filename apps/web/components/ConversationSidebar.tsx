'use client';

import { motion, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import type { Conversation } from '@/lib/api';
import { LoadingState } from '@/components/ui/LoadingState';
import { GlowButton } from '@/components/visual/GlowButton';
import { motionTransition, staggerContainer, staggerItem } from '@/lib/motion';
import { uiText } from '@/lib/ui-text';

interface ConversationSidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  loading?: boolean;
  loadError?: string | null;
  onRetryLoad?: () => void;
  onSelect: (id: string) => void;
  onCreate: () => void;
  onDelete: (id: string) => void;
  onRename: (id: string, title: string) => Promise<void>;
  onLogout?: () => void;
}

export function ConversationSidebar({
  conversations,
  activeId,
  loading = false,
  loadError = null,
  onRetryLoad,
  onSelect,
  onCreate,
  onDelete,
  onRename,
  onLogout,
}: ConversationSidebarProps) {
  const reduced = useReducedMotion();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [savingRename, setSavingRename] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingId) inputRef.current?.focus();
  }, [editingId]);

  const startRename = (conversation: Conversation) => {
    setEditingId(conversation.id);
    setEditTitle(conversation.title);
  };

  const cancelRename = () => {
    setEditingId(null);
    setEditTitle('');
  };

  const commitRename = async (id: string) => {
    const title = editTitle.trim();
    if (!title || savingRename) {
      cancelRename();
      return;
    }
    const original = conversations.find((c) => c.id === id)?.title;
    if (title === original) {
      cancelRename();
      return;
    }
    try {
      setSavingRename(true);
      await onRename(id, title);
      cancelRename();
    } catch {
      /* parent shows banner */
    } finally {
      setSavingRename(false);
    }
  };

  return (
    <aside className="glass-panel relative z-20 flex h-full w-full flex-col border-r border-[var(--hyphai-border)] md:w-72 lg:w-80">
      <div className="border-b border-[var(--hyphai-border)] px-4 py-5">
        <h1 className="font-display text-xl font-bold tracking-tight text-emerald-400">Hyphai</h1>
        <p className="mt-1 text-xs text-zinc-500">{uiText.sidebar.tagline}</p>
      </div>

      <div className="p-3">
        <GlowButton onClick={onCreate} className="w-full">
          + {uiText.sidebar.newChat}
        </GlowButton>
      </div>

      <motion.ul
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="flex-1 overflow-y-auto px-2 pb-4"
      >
        {loading ? (
          <li>
            <LoadingState label={uiText.sidebar.loadingChats} compact />
          </li>
        ) : loadError ? (
          <li className="px-3 py-6 text-center">
            <p className="text-sm text-red-400">{loadError}</p>
            {onRetryLoad && (
              <button
                type="button"
                onClick={onRetryLoad}
                className="hyphai-interactive hyphai-focus mt-3 rounded-lg bg-zinc-800/80 px-4 py-2.5 text-sm text-zinc-200 hover:bg-zinc-700"
              >
                {uiText.sidebar.retry}
              </button>
            )}
          </li>
        ) : conversations.length === 0 ? (
          <li className="px-3 py-6 text-center text-sm text-zinc-500">{uiText.sidebar.empty}</li>
        ) : (
          conversations.map((conversation) => (
            <motion.li
              key={conversation.id}
              variants={staggerItem}
              transition={motionTransition(!!reduced)}
              className="relative mb-1"
            >
              <div
                className={`group relative flex items-center gap-1 rounded-xl transition ${
                  activeId === conversation.id ? '' : 'hover:bg-zinc-900/50'
                }`}
              >
                {activeId === conversation.id && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-xl bg-emerald-950/70 ring-1 ring-emerald-600/40"
                    transition={reduced ? { duration: 0.01 } : { type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                {editingId === conversation.id ? (
                  <input
                    ref={inputRef}
                    type="text"
                    value={editTitle}
                    disabled={savingRename}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onBlur={() => void commitRename(conversation.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        void commitRename(conversation.id);
                      }
                      if (e.key === 'Escape') {
                        e.preventDefault();
                        cancelRename();
                      }
                    }}
                    className="hyphai-focus relative z-10 flex-1 rounded-lg border border-emerald-700/60 bg-zinc-950/90 px-3 py-2 text-sm text-zinc-100 focus:ring-1 focus:ring-emerald-600"
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => onSelect(conversation.id)}
                    onDoubleClick={(e) => {
                      e.preventDefault();
                      startRename(conversation);
                    }}
                    className="hyphai-interactive hyphai-focus relative z-10 flex-1 truncate rounded-lg px-3 py-2.5 text-left text-sm text-zinc-300 hover:text-zinc-100"
                    title="Двойной клик — переименовать"
                  >
                    {conversation.title}
                  </button>
                )}
                {editingId !== conversation.id && (
                  <>
                    <button
                      type="button"
                      onClick={() => startRename(conversation)}
                      className="hyphai-interactive hyphai-focus relative z-10 flex min-h-9 min-w-9 items-center justify-center rounded-lg text-xs text-zinc-500 opacity-0 hover:bg-zinc-800/80 hover:text-emerald-400 group-hover:opacity-100"
                      aria-label={uiText.sidebar.renameAria}
                      title={uiText.sidebar.renameAria}
                    >
                      ✎
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(conversation.id)}
                      className="hyphai-interactive hyphai-focus relative z-10 flex min-h-9 min-w-9 items-center justify-center rounded-lg text-xs text-zinc-500 opacity-0 hover:bg-zinc-800/80 hover:text-red-400 group-hover:opacity-100"
                      aria-label={uiText.sidebar.deleteAria}
                      title={uiText.sidebar.deleteAria}
                    >
                      ×
                    </button>
                  </>
                )}
              </div>
            </motion.li>
          ))
        )}
      </motion.ul>
      {onLogout && (
        <div className="border-t border-[var(--hyphai-border)] p-3">
          <button
            type="button"
            onClick={onLogout}
            className="hyphai-interactive hyphai-focus w-full rounded-lg px-4 py-2.5 text-sm text-zinc-500 hover:bg-zinc-900/60 hover:text-zinc-300"
          >
            {uiText.sidebar.logout}
          </button>
        </div>
      )}
    </aside>
  );
}

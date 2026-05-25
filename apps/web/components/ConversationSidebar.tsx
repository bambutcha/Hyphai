'use client';

import { useEffect, useRef, useState } from 'react';
import type { Conversation } from '@/lib/api';
import { LoadingState } from '@/components/ui/LoadingState';
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
    <aside className="flex h-full w-full flex-col border-r border-emerald-900/40 bg-zinc-950 md:w-72 lg:w-80">
      <div className="border-b border-emerald-900/40 px-4 py-5">
        <h1 className="text-xl font-semibold tracking-tight text-emerald-400">Hyphai</h1>
        <p className="mt-1 text-xs text-zinc-500">{uiText.sidebar.tagline}</p>
      </div>

      <div className="p-3">
        <button
          type="button"
          onClick={onCreate}
          className="w-full rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-md shadow-emerald-900/20 transition hover:scale-[1.01] hover:bg-emerald-500 active:scale-[0.99]"
        >
          + {uiText.sidebar.newChat}
        </button>
      </div>

      <ul className="flex-1 overflow-y-auto px-2 pb-4">
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
                className="mt-3 rounded-lg bg-zinc-800 px-4 py-2 text-sm text-zinc-200 transition hover:bg-zinc-700"
              >
                {uiText.sidebar.retry}
              </button>
            )}
          </li>
        ) : conversations.length === 0 ? (
          <li className="px-3 py-6 text-center text-sm text-zinc-500">{uiText.sidebar.empty}</li>
        ) : (
          conversations.map((conversation, index) => (
            <li
              key={conversation.id}
              className="animate-hyphae-slide-in mb-1.5"
              style={{ animationDelay: `${Math.min(index * 40, 200)}ms` }}
            >
              <div
                className={`group flex items-center gap-1 rounded-xl transition ${
                  activeId === conversation.id
                    ? 'bg-emerald-950/80 ring-1 ring-emerald-700/50'
                    : 'hover:bg-zinc-900/80'
                }`}
              >
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
                    className="flex-1 rounded-lg border border-emerald-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-600"
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
                    className="flex-1 truncate px-3 py-2.5 text-left text-sm text-zinc-300 transition"
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
                      className="rounded px-1.5 py-1 text-xs text-zinc-600 opacity-0 transition hover:text-emerald-400 group-hover:opacity-100"
                      aria-label={uiText.sidebar.renameAria}
                    >
                      ✎
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(conversation.id)}
                      className="rounded px-1.5 py-1 text-xs text-zinc-600 opacity-0 transition hover:text-red-400 group-hover:opacity-100"
                      aria-label={uiText.sidebar.deleteAria}
                    >
                      ×
                    </button>
                  </>
                )}
              </div>
            </li>
          ))
        )}
      </ul>
      {onLogout && (
        <div className="border-t border-emerald-900/40 p-3">
          <button
            type="button"
            onClick={onLogout}
            className="w-full rounded-lg px-4 py-2 text-sm text-zinc-500 transition hover:bg-zinc-900 hover:text-zinc-300"
          >
            {uiText.sidebar.logout}
          </button>
        </div>
      )}
    </aside>
  );
}

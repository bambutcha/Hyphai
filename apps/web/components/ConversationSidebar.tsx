'use client';

import type { Conversation } from '@/lib/api';

interface ConversationSidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onCreate: () => void;
  onDelete: (id: string) => void;
  onLogout?: () => void;
}

export function ConversationSidebar({
  conversations,
  activeId,
  onSelect,
  onCreate,
  onDelete,
  onLogout,
}: ConversationSidebarProps) {
  return (
    <aside className="flex h-full w-full flex-col border-r border-emerald-900/40 bg-zinc-950 md:w-72 lg:w-80">
      <div className="border-b border-emerald-900/40 px-4 py-5">
        <h1 className="text-xl font-semibold tracking-tight text-emerald-400">
          Hyphai
        </h1>
        <p className="mt-1 text-xs text-zinc-500">
          Universal chat · living network
        </p>
      </div>

      <div className="p-3">
        <button
          type="button"
          onClick={onCreate}
          className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-500"
        >
          + New chat
        </button>
      </div>

      <ul className="flex-1 overflow-y-auto px-2 pb-4">
        {conversations.length === 0 ? (
          <li className="px-3 py-6 text-center text-sm text-zinc-500">
            No conversations yet
          </li>
        ) : (
          conversations.map((conversation) => (
            <li key={conversation.id} className="group mb-1">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => onSelect(conversation.id)}
                  className={`flex-1 truncate rounded-lg px-3 py-2.5 text-left text-sm transition ${
                    activeId === conversation.id
                      ? 'bg-emerald-950/80 text-emerald-100 ring-1 ring-emerald-700/50'
                      : 'text-zinc-300 hover:bg-zinc-900'
                  }`}
                >
                  {conversation.title}
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(conversation.id)}
                  className="rounded px-2 py-1 text-xs text-zinc-600 opacity-0 transition hover:text-red-400 group-hover:opacity-100"
                  aria-label="Delete conversation"
                >
                  x
                </button>
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
            className="w-full rounded-lg px-4 py-2 text-sm text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300"
          >
            Выйти
          </button>
        </div>
      )}
    </aside>
  );
}

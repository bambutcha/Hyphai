'use client';

import { useCallback, useEffect, useState } from 'react';
import { AuthScreen } from '@/components/AuthScreen';
import { ConversationSidebar } from '@/components/ConversationSidebar';
import { MessagePane } from '@/components/MessagePane';
import { api, clearAuthToken, getAuthToken, type Conversation, type Message } from '@/lib/api';
import { connectConversationWs } from '@/lib/ws';

export function ChatApp() {
  const [authed, setAuthed] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeConversation = conversations.find((c) => c.id === activeId) ?? null;

  useEffect(() => {
    setAuthed(!!getAuthToken());
  }, []);

  const loadConversations = useCallback(async () => {
    const data = await api.listConversations();
    setConversations(data);
    return data;
  }, []);

  const loadMessages = useCallback(async (id: string) => {
    const data = await api.listMessages(id);
    setMessages(data);
  }, []);

  useEffect(() => {
    if (!authed) return;
    loadConversations().catch((e: Error) => setError(e.message));
  }, [authed, loadConversations]);

  useEffect(() => {
    if (!activeId || !authed) {
      setMessages([]);
      return;
    }
    loadMessages(activeId).catch((e: Error) => setError(e.message));
  }, [activeId, authed, loadMessages]);

  useEffect(() => {
    if (!activeId || !authed) return;

    return connectConversationWs(activeId, (event) => {
      if (event.type === 'messages.created' && event.conversationId === activeId) {
        setMessages((prev) => {
          const ids = new Set(prev.map((m) => m.id));
          const added = event.messages.filter((m) => !ids.has(m.id));
          return [...prev, ...added];
        });
        loadConversations();
      }
    });
  }, [activeId, authed, loadConversations]);

  if (!authed) {
    return <AuthScreen onAuthenticated={() => setAuthed(true)} />;
  }

  const handleCreate = async () => {
    try {
      setError(null);
      const created = await api.createConversation();
      await loadConversations();
      setActiveId(created.id);
      setMessages([]);
      setDraft('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to create chat');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setError(null);
      await api.deleteConversation(id);
      const remaining = await loadConversations();
      if (activeId === id) {
        setActiveId(remaining[0]?.id ?? null);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to delete chat');
    }
  };

  const handleSend = async () => {
    if (!activeId || !draft.trim()) return;
    try {
      setSending(true);
      setError(null);
      await api.sendMessage(activeId, draft.trim());
      setDraft('');
      await loadMessages(activeId);
      await loadConversations();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleLogout = () => {
    clearAuthToken();
    setAuthed(false);
    setActiveId(null);
    setConversations([]);
    setMessages([]);
  };

  return (
    <div className="flex h-dvh flex-col md:flex-row">
      <ConversationSidebar
        conversations={conversations}
        activeId={activeId}
        onSelect={setActiveId}
        onCreate={handleCreate}
        onDelete={handleDelete}
        onLogout={handleLogout}
      />
      <div className="flex min-h-0 flex-1 flex-col">
        {error && (
          <div className="bg-red-950/80 px-4 py-2 text-center text-sm text-red-200">
            {error}
          </div>
        )}
        <MessagePane
          messages={messages}
          conversationTitle={activeConversation?.title ?? null}
          draft={draft}
          onDraftChange={setDraft}
          onSend={handleSend}
          sending={sending}
        />
      </div>
    </div>
  );
}

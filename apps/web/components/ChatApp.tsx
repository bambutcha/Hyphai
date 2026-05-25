'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AuthScreen } from '@/components/AuthScreen';
import { ConversationSidebar } from '@/components/ConversationSidebar';
import { MessagePane } from '@/components/MessagePane';
import { ErrorBanner } from '@/components/ui/ErrorBanner';
import type { ConnectionStatus } from '@/components/ui/ConnectionBadge';
import {
  api,
  clearAuthToken,
  getAuthToken,
  getErrorMessage,
  isUnauthorizedError,
  type Conversation,
  type Message,
} from '@/lib/api';
import { connectConversationWs } from '@/lib/ws';

type BannerAction = 'send' | 'create' | 'delete' | null;

export function ChatApp() {
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [conversationsError, setConversationsError] = useState<string | null>(null);
  const [messagesError, setMessagesError] = useState<string | null>(null);
  const [bannerError, setBannerError] = useState<string | null>(null);
  const [bannerAction, setBannerAction] = useState<BannerAction>(null);
  const [wsStatus, setWsStatus] = useState<ConnectionStatus | null>(null);
  const deleteTargetRef = useRef<string | null>(null);

  const activeConversation = conversations.find((c) => c.id === activeId) ?? null;

  useEffect(() => {
    setAuthed(!!getAuthToken());
  }, []);

  const handleUnauthorized = useCallback((err: unknown): boolean => {
    if (!isUnauthorizedError(err)) return false;
    clearAuthToken();
    setAuthError(getErrorMessage(err));
    setAuthed(false);
    setActiveId(null);
    setConversations([]);
    setMessages([]);
    setBannerError(null);
    setConversationsError(null);
    setMessagesError(null);
    setWsStatus(null);
    return true;
  }, []);

  const loadConversations = useCallback(async () => {
    setLoadingConversations(true);
    setConversationsError(null);
    try {
      const data = await api.listConversations();
      setConversations(data);
      return data;
    } catch (err) {
      if (handleUnauthorized(err)) return [];
      const message = getErrorMessage(err);
      setConversationsError(message);
      throw err;
    } finally {
      setLoadingConversations(false);
    }
  }, [handleUnauthorized]);

  const loadMessages = useCallback(
    async (id: string) => {
      setLoadingMessages(true);
      setMessagesError(null);
      try {
        const data = await api.listMessages(id);
        setMessages(data);
      } catch (err) {
        if (handleUnauthorized(err)) return;
        const message = getErrorMessage(err);
        setMessagesError(message);
        throw err;
      } finally {
        setLoadingMessages(false);
      }
    },
    [handleUnauthorized],
  );

  useEffect(() => {
    if (!authed) return;
    loadConversations().catch(() => undefined);
  }, [authed, loadConversations]);

  useEffect(() => {
    if (!activeId || !authed) {
      setMessages([]);
      setMessagesError(null);
      setWsStatus(null);
      return;
    }
    loadMessages(activeId).catch(() => undefined);
  }, [activeId, authed, loadMessages]);

  useEffect(() => {
    if (!activeId || !authed) return;

    return connectConversationWs(
      activeId,
      (event) => {
        if (event.type === 'messages.created' && event.conversationId === activeId) {
          setMessages((prev) => {
            const ids = new Set(prev.map((m) => m.id));
            const added = event.messages.filter((m) => !ids.has(m.id));
            return [...prev, ...added];
          });
          loadConversations().catch(() => undefined);
        }
      },
      { onConnectionChange: setWsStatus },
    );
  }, [activeId, authed, loadConversations]);

  if (!authed) {
    return (
      <AuthScreen
        initialError={authError}
        onAuthenticated={() => {
          setAuthError(null);
          setAuthed(true);
        }}
      />
    );
  }

  const handleCreate = async () => {
    try {
      setBannerError(null);
      setBannerAction(null);
      const created = await api.createConversation();
      await loadConversations();
      setActiveId(created.id);
      setMessages([]);
      setDraft('');
    } catch (err) {
      if (handleUnauthorized(err)) return;
      setBannerError(getErrorMessage(err));
      setBannerAction('create');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setBannerError(null);
      setBannerAction(null);
      deleteTargetRef.current = id;
      await api.deleteConversation(id);
      const remaining = await loadConversations();
      if (activeId === id) {
        setActiveId(remaining[0]?.id ?? null);
      }
    } catch (err) {
      if (handleUnauthorized(err)) return;
      setBannerError(getErrorMessage(err));
      setBannerAction('delete');
    }
  };

  const handleSend = async () => {
    if (!activeId || !draft.trim()) return;
    try {
      setSending(true);
      setBannerError(null);
      setBannerAction(null);
      await api.sendMessage(activeId, draft.trim());
      setDraft('');
      await loadMessages(activeId);
      await loadConversations();
    } catch (err) {
      if (handleUnauthorized(err)) return;
      setBannerError(getErrorMessage(err));
      setBannerAction('send');
    } finally {
      setSending(false);
    }
  };

  const handleBannerRetry = () => {
    if (bannerAction === 'send') {
      void handleSend();
      return;
    }
    if (bannerAction === 'create') {
      void handleCreate();
      return;
    }
    if (bannerAction === 'delete' && deleteTargetRef.current) {
      void handleDelete(deleteTargetRef.current);
    }
  };

  const handleLogout = () => {
    clearAuthToken();
    setAuthed(false);
    setActiveId(null);
    setConversations([]);
    setMessages([]);
    setBannerError(null);
    setConversationsError(null);
    setMessagesError(null);
    setWsStatus(null);
  };

  return (
    <div className="flex h-dvh flex-col md:flex-row">
      <ConversationSidebar
        conversations={conversations}
        activeId={activeId}
        loading={loadingConversations}
        loadError={conversationsError}
        onRetryLoad={() => loadConversations().catch(() => undefined)}
        onSelect={setActiveId}
        onCreate={handleCreate}
        onDelete={handleDelete}
        onLogout={handleLogout}
      />
      <div className="flex min-h-0 flex-1 flex-col">
        {bannerError && (
          <ErrorBanner
            message={bannerError}
            onDismiss={() => {
              setBannerError(null);
              setBannerAction(null);
            }}
            onRetry={bannerAction ? handleBannerRetry : undefined}
          />
        )}
        <MessagePane
          messages={messages}
          conversationTitle={activeConversation?.title ?? null}
          draft={draft}
          loading={loadingMessages}
          loadError={messagesError}
          onRetryLoad={
            activeId ? () => loadMessages(activeId).catch(() => undefined) : undefined
          }
          connectionStatus={wsStatus}
          onDraftChange={setDraft}
          onSend={handleSend}
          sending={sending}
        />
      </div>
    </div>
  );
}

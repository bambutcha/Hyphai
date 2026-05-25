'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AuthScreen } from '@/components/AuthScreen';
import { ChatEmptyState } from '@/components/ChatEmptyState';
import { ConversationSidebar } from '@/components/ConversationSidebar';
import { MessagePane } from '@/components/MessagePane';
import { ErrorBanner } from '@/components/ui/ErrorBanner';
import type { ConnectionStatus } from '@/components/ui/ConnectionBadge';
import { HyphaeBackground } from '@/components/visual/HyphaeBackground';
import { pageTransition } from '@/lib/motion';
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

type BannerAction = 'send' | 'create' | 'delete' | 'rename' | null;

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
  const renameTargetRef = useRef<{ id: string; title: string } | null>(null);

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
      await loadConversations();
      if (activeId === id) {
        setActiveId(null);
        setMessages([]);
        setDraft('');
      }
    } catch (err) {
      if (handleUnauthorized(err)) return;
      setBannerError(getErrorMessage(err));
      setBannerAction('delete');
    }
  };

  const handleRename = async (id: string, title: string) => {
    try {
      setBannerError(null);
      setBannerAction(null);
      renameTargetRef.current = { id, title };
      const updated = await api.updateConversation(id, title);
      setConversations((prev) => prev.map((c) => (c.id === id ? updated : c)));
    } catch (err) {
      if (handleUnauthorized(err)) return;
      setBannerError(getErrorMessage(err));
      setBannerAction('rename');
      throw err;
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
      return;
    }
    if (bannerAction === 'rename' && renameTargetRef.current) {
      const { id, title } = renameTargetRef.current;
      void handleRename(id, title);
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

  const showWelcome =
    !loadingConversations && !conversationsError && conversations.length === 0;
  const showPick =
    !loadingConversations &&
    !conversationsError &&
    conversations.length > 0 &&
    !activeId;
  const showChat = !!activeId && !!activeConversation;

  const mainView = showWelcome
    ? 'welcome'
    : showPick
      ? 'pick'
      : showChat
        ? 'chat'
        : null;

  return (
    <div className="relative flex h-dvh flex-col overflow-hidden md:flex-row">
      <HyphaeBackground />
      <ConversationSidebar
        conversations={conversations}
        activeId={activeId}
        loading={loadingConversations}
        loadError={conversationsError}
        onRetryLoad={() => loadConversations().catch(() => undefined)}
        onSelect={setActiveId}
        onCreate={handleCreate}
        onDelete={handleDelete}
        onRename={handleRename}
        onLogout={handleLogout}
      />
      <div className="relative z-10 flex min-h-0 flex-1 flex-col">
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
        <AnimatePresence mode="wait">
          {mainView === 'welcome' && (
            <motion.div
              key="welcome"
              className="flex min-h-0 flex-1 flex-col"
              variants={pageTransition}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <ChatEmptyState variant="welcome" onCreateChat={handleCreate} />
            </motion.div>
          )}
          {mainView === 'pick' && (
            <motion.div
              key="pick"
              className="flex min-h-0 flex-1 flex-col"
              variants={pageTransition}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <ChatEmptyState variant="pick" onCreateChat={handleCreate} />
            </motion.div>
          )}
          {mainView === 'chat' && activeConversation && (
            <motion.div
              key={`chat-${activeId}`}
              className="flex min-h-0 flex-1 flex-col"
              variants={pageTransition}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <MessagePane
                messages={messages}
                conversationTitle={activeConversation.title}
                draft={draft}
                loading={loadingMessages}
                loadError={messagesError}
                onRetryLoad={() => loadMessages(activeId!).catch(() => undefined)}
                connectionStatus={wsStatus}
                onDraftChange={setDraft}
                onSend={handleSend}
                sending={sending}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

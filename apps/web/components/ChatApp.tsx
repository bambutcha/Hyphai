'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { ModelMeta } from '@/components/ModelBadge';
import { ChatEmptyState } from '@/components/ChatEmptyState';
import { ConversationSidebar } from '@/components/ConversationSidebar';
import { MessagePane } from '@/components/MessagePane';
import { ShareDialog } from '@/components/ShareDialog';
import { ErrorBanner } from '@/components/ui/ErrorBanner';
import { useToast } from '@/components/ui/ToastProvider';
import type { ConnectionStatus } from '@/components/ui/ConnectionBadge';
import { HyphaeBackground } from '@/components/visual/HyphaeBackground';
import { pageTransition } from '@/lib/motion';
import {
  api,
  clearAuthToken,
  getErrorMessage,
  isUnauthorizedError,
  type Conversation,
  type LlmModelOption,
  type Message,
} from '@/lib/api';
import { DEFAULT_LLM_MODEL_ID, getStoredLlmModel, setStoredLlmModel } from '@/lib/llm-storage';
import { sendMessageStream } from '@/lib/message-stream';
import { uiText } from '@/lib/ui-text';
import { connectConversationWs } from '@/lib/ws';

type BannerAction = 'send' | 'create' | 'delete' | 'rename' | null;

export function ChatApp() {
  const toast = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [streamingContent, setStreamingContent] = useState<string | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [conversationsError, setConversationsError] = useState<string | null>(null);
  const [messagesError, setMessagesError] = useState<string | null>(null);
  const [bannerError, setBannerError] = useState<string | null>(null);
  const [bannerAction, setBannerAction] = useState<BannerAction>(null);
  const [wsStatus, setWsStatus] = useState<ConnectionStatus | null>(null);
  const [llmModels, setLlmModels] = useState<LlmModelOption[]>([]);
  const [selectedModelId, setSelectedModelId] = useState(DEFAULT_LLM_MODEL_ID);
  const [lastModelMeta, setLastModelMeta] = useState<ModelMeta | null>(null);
  const [shareOpen, setShareOpen] = useState(false);
  const deleteTargetRef = useRef<string | null>(null);
  const renameTargetRef = useRef<{ id: string; title: string } | null>(null);
  const lastSendContentRef = useRef('');

  const activeConversation = conversations.find((c) => c.id === activeId) ?? null;

  const closeMobileSidebar = useCallback(() => setMobileSidebarOpen(false), []);

  const handleUnauthorized = useCallback((err: unknown): boolean => {
    if (!isUnauthorizedError(err)) return false;
    clearAuthToken();
    window.location.reload();
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
    loadConversations().catch(() => undefined);
  }, [loadConversations]);

  useEffect(() => {
    const stored = getStoredLlmModel();
    api
      .listLlmModels()
      .then((data) => {
        setLlmModels(data.models);
        const ids = new Set(data.models.map((m) => m.id));
        if (stored && ids.has(stored)) {
          setSelectedModelId(stored);
        } else if (ids.has(data.defaultModelId)) {
          setSelectedModelId(data.defaultModelId);
        }
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    if (!activeId) {
      setMessages([]);
      setMessagesError(null);
      setWsStatus(null);
      setLastModelMeta(null);
      return;
    }
    setLastModelMeta(null);
    loadMessages(activeId).catch(() => undefined);
  }, [activeId, loadMessages]);

  useEffect(() => {
    if (!activeId) return;

    return connectConversationWs(
      activeId,
      (event) => {
        if (event.type === 'messages.created' && event.conversationId === activeId) {
          setMessages((prev) => {
            const ids = new Set(prev.map((m) => m.id));
            const added = event.messages.filter((m) => !ids.has(m.id));
            if (added.length === 0) return prev;
            return [...prev, ...added];
          });
          loadConversations().catch(() => undefined);
        }
      },
      { onConnectionChange: setWsStatus },
    );
  }, [activeId, loadConversations]);

  const handleCreate = async () => {
    try {
      setBannerError(null);
      setBannerAction(null);
      const created = await api.createConversation();
      await loadConversations();
      setActiveId(created.id);
      setMessages([]);
      setDraft('');
      closeMobileSidebar();
      toast.success(uiText.toast.chatCreated);
    } catch (err) {
      if (handleUnauthorized(err)) return;
      toast.error(uiText.toast.createFailed);
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
      toast.success(uiText.toast.chatDeleted);
    } catch (err) {
      if (handleUnauthorized(err)) return;
      toast.error(uiText.toast.deleteFailed);
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
      toast.success(uiText.toast.chatRenamed);
    } catch (err) {
      if (handleUnauthorized(err)) return;
      toast.error(uiText.toast.renameFailed);
      setBannerError(getErrorMessage(err));
      setBannerAction('rename');
      throw err;
    }
  };

  const handleFork = async (messageId: string) => {
    if (!activeId) return;
    try {
      const forked = await api.forkConversation(activeId, messageId);
      await loadConversations();
      setActiveId(forked.id);
      setMessages([]);
      setDraft('');
      closeMobileSidebar();
      toast.success(uiText.fork.success);
    } catch (err) {
      if (handleUnauthorized(err)) return;
      toast.error(uiText.fork.failed);
    }
  };

  const handleSend = async () => {
    if (!activeId || !draft.trim() || sending) return;

    const content = draft.trim();
    lastSendContentRef.current = content;
    setSending(true);
    setStreamingContent(null);
    setBannerError(null);
    setBannerAction(null);
    setDraft('');

    try {
      await sendMessageStream(activeId, content, selectedModelId, {
        onUserMessage: (message) => {
          setMessages((prev) => {
            if (prev.some((m) => m.id === message.id)) return prev;
            return [...prev, message];
          });
        },
        onChunk: (delta) => {
          setStreamingContent((prev) => (prev ?? '') + delta);
        },
        onDone: (payload) => {
          setStreamingContent(null);
          setLastModelMeta({
            modelUsed: payload.modelUsed,
            requestedModel: payload.requestedModel,
            usedFallback: payload.usedFallback,
          });
          setMessages((prev) => {
            const ids = new Set(prev.map((m) => m.id));
            if (ids.has(payload.assistant.id)) {
              return prev.map((m) =>
                m.id === payload.assistant.id ? payload.assistant : m,
              );
            }
            return [...prev, payload.assistant];
          });
          void loadConversations();
        },
        onError: (error) => {
          setStreamingContent(null);
          setDraft(content);
          setBannerError(error);
          setBannerAction('send');
        },
      });
    } catch (err) {
      if (handleUnauthorized(err)) return;
      setStreamingContent(null);
      setDraft(content);
      setBannerError(getErrorMessage(err));
      setBannerAction('send');
    } finally {
      setSending(false);
      setStreamingContent(null);
    }
  };

  const handleBannerRetry = () => {
    if (bannerAction === 'send') {
      if (!draft.trim() && lastSendContentRef.current) {
        setDraft(lastSendContentRef.current);
      }
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
    window.location.reload();
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

  const openMobileMenu = () => setMobileSidebarOpen(true);

  return (
    <div className="relative flex h-dvh flex-col overflow-hidden md:flex-row">
      <HyphaeBackground />

      {mobileSidebarOpen && (
        <button
          type="button"
          aria-label={uiText.shell.closeMenu}
          className="fixed inset-0 z-30 bg-black/60 md:hidden"
          onClick={closeMobileSidebar}
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 z-40 w-72 max-w-[85vw] transform transition-transform duration-300 ease-out md:relative md:z-20 md:w-72 md:max-w-none md:translate-x-0 lg:w-80 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <ConversationSidebar
          conversations={conversations}
          activeId={activeId}
          loading={loadingConversations}
          loadError={conversationsError}
          onRetryLoad={() => loadConversations().catch(() => undefined)}
          onSelect={(id) => {
            setActiveId(id);
            closeMobileSidebar();
          }}
          onCreate={handleCreate}
          onDelete={handleDelete}
          onRename={handleRename}
          onLogout={handleLogout}
        />
      </div>

      <div className="relative z-10 flex min-h-0 flex-1 flex-col">
        {!showChat && (
          <button
            type="button"
            aria-label={uiText.shell.openMenu}
            onClick={openMobileMenu}
            className="hyphai-focus hyphai-interactive fixed top-3 left-3 z-50 rounded-lg glass-panel p-2 text-zinc-300 md:hidden"
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
                llmModels={llmModels}
                selectedModelId={selectedModelId}
                onModelChange={(id) => {
                  setSelectedModelId(id);
                  setStoredLlmModel(id);
                }}
                onDraftChange={setDraft}
                onSend={handleSend}
                sending={sending}
                streamingContent={streamingContent}
                onOpenMenu={openMobileMenu}
                lastModelMeta={lastModelMeta}
                onForkMessage={(messageId) => void handleFork(messageId)}
                onShare={() => setShareOpen(true)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {activeId && (
        <ShareDialog
          conversationId={activeId}
          open={shareOpen}
          onClose={() => setShareOpen(false)}
          onError={(message) => toast.error(message)}
          onCopied={() => toast.success(uiText.share.copied)}
        />
      )}
    </div>
  );
}

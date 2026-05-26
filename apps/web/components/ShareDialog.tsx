'use client';

import { useEffect, useState } from 'react';
import { GlassPanel } from '@/components/visual/GlassPanel';
import { GlowButton } from '@/components/visual/GlowButton';
import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/api';
import { uiText } from '@/lib/ui-text';

interface ShareDialogProps {
  conversationId: string;
  open: boolean;
  onClose: () => void;
  onError: (message: string) => void;
  onCopied: () => void;
}

export function ShareDialog({
  conversationId,
  open,
  onClose,
  onError,
  onCopied,
}: ShareDialogProps) {
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      setShareUrl(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    api
      .enableShare(conversationId)
      .then((data) => {
        if (!cancelled) setShareUrl(data.shareUrl);
      })
      .catch((err) => {
        if (!cancelled) onError(getErrorMessage(err));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [open, conversationId, onError]);

  if (!open) return null;

  const copyLink = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      onCopied();
    } catch {
      onError(uiText.share.failed);
    }
  };

  const disableShare = async () => {
    try {
      await api.disableShare(conversationId);
      onClose();
    } catch (err) {
      onError(getErrorMessage(err));
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4">
      <GlassPanel className="w-full max-w-md p-6">
        <h3 className="font-display text-lg font-semibold text-zinc-100">{uiText.share.title}</h3>
        <p className="mt-2 text-sm text-zinc-400">{uiText.share.readOnly}</p>

        {loading && <p className="mt-4 text-sm text-zinc-500">…</p>}

        {!loading && shareUrl && (
          <div className="mt-4">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="hyphai-focus w-full rounded-lg border border-zinc-700 bg-zinc-950/80 px-3 py-2 text-xs text-zinc-300"
            />
            <div className="mt-4 flex flex-wrap gap-2">
              <GlowButton type="button" onClick={() => void copyLink()}>
                {uiText.share.copy}
              </GlowButton>
              <button
                type="button"
                onClick={() => void disableShare()}
                className="hyphai-interactive hyphai-focus rounded-lg px-4 py-2 text-sm text-zinc-400 hover:bg-zinc-800/80"
              >
                {uiText.share.disable}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="hyphai-interactive hyphai-focus rounded-lg px-4 py-2 text-sm text-zinc-500 hover:text-zinc-300"
              >
                Закрыть
              </button>
            </div>
          </div>
        )}
      </GlassPanel>
    </div>
  );
}

'use client';

import { uiText } from '@/lib/ui-text';

type EmptyVariant = 'welcome' | 'pick';

interface ChatEmptyStateProps {
  variant: EmptyVariant;
  onCreateChat: () => void;
}

export function ChatEmptyState({ variant, onCreateChat }: ChatEmptyStateProps) {
  const isWelcome = variant === 'welcome';
  const title = isWelcome ? uiText.empty.welcomeTitle : uiText.empty.pickTitle;
  const subtitle = isWelcome ? uiText.empty.welcomeSubtitle : uiText.empty.pickSubtitle;
  const cta = isWelcome ? uiText.empty.welcomeCta : uiText.empty.pickCta;

  return (
    <div className="chat-area-bg relative flex h-full min-h-0 flex-1 flex-col items-center justify-center overflow-hidden px-6 py-12">
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        aria-hidden
      >
        <div className="animate-hyphae-pulse-soft absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="animate-hyphae-pulse-soft absolute bottom-1/4 right-1/4 h-48 w-48 rounded-full bg-emerald-600/10 blur-3xl [animation-delay:1s]" />
      </div>

      <div className="animate-hyphae-fade-in relative z-10 mx-auto max-w-md text-center">
        <div
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-950/60 text-4xl ring-1 ring-emerald-800/50"
          aria-hidden
        >
          🍄
        </div>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-100">{title}</h2>
        <p className="mt-3 text-sm leading-relaxed text-zinc-400">{subtitle}</p>
        <button
          type="button"
          onClick={onCreateChat}
          className="mt-8 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-emerald-900/30 transition hover:scale-[1.02] hover:bg-emerald-500 active:scale-[0.98]"
        >
          {cta}
        </button>
      </div>

      <svg
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 w-full text-emerald-900/20"
        viewBox="0 0 400 80"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          fill="currentColor"
          d="M0,40 Q100,80 200,40 T400,40 L400,80 L0,80 Z"
        />
      </svg>
    </div>
  );
}

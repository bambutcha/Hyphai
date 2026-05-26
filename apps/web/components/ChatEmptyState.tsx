'use client';

import { motion, useReducedMotion } from 'motion/react';
import { HyphaeGraphEmpty } from '@/components/visual/HyphaeGraphEmpty';
import { HyphaeIllustration } from '@/components/visual/HyphaeIllustration';
import { GlowButton } from '@/components/visual/GlowButton';
import { GlassPanel } from '@/components/visual/GlassPanel';
import { fadeUp, motionTransition } from '@/lib/motion';
import { uiText } from '@/lib/ui-text';

type EmptyVariant = 'welcome' | 'pick';

interface ChatEmptyStateProps {
  variant: EmptyVariant;
  onCreateChat: () => void;
}

export function ChatEmptyState({ variant, onCreateChat }: ChatEmptyStateProps) {
  const reduced = useReducedMotion();
  const isWelcome = variant === 'welcome';
  const title = isWelcome ? uiText.empty.welcomeTitle : uiText.empty.pickTitle;
  const subtitle = isWelcome ? uiText.empty.welcomeSubtitle : uiText.empty.pickSubtitle;
  const cta = isWelcome ? uiText.empty.welcomeCta : uiText.empty.pickCta;

  return (
    <div className="chat-main-area relative flex h-full min-h-0 flex-1 flex-col items-center justify-center overflow-hidden px-6 py-12 pt-safe">
      {isWelcome ? (
        <HyphaeGraphEmpty className="mb-6" onNodeClick={onCreateChat} />
      ) : (
        <HyphaeIllustration className="mb-8" />
      )}

      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={motionTransition(!!reduced)}
        className="relative z-10 w-full max-w-md"
      >
        <GlassPanel className="px-8 py-10 text-center shadow-[0_0_60px_rgba(52,211,153,0.08)]">
          <h2 className="font-display text-2xl font-bold tracking-tight text-zinc-50">{title}</h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400">{subtitle}</p>
          <div className="mt-8 flex justify-center">
            <GlowButton onClick={onCreateChat}>{cta}</GlowButton>
          </div>
        </GlassPanel>
      </motion.div>
    </div>
  );
}

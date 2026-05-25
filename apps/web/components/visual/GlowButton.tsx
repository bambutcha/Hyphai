'use client';

import { motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';
import { springSnappy } from '@/lib/motion';

interface GlowButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'ghost';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
}

export function GlowButton({
  children,
  variant = 'primary',
  className = '',
  disabled,
  type = 'button',
  onClick,
}: GlowButtonProps) {
  const reduced = useReducedMotion();

  const base =
    variant === 'primary'
      ? 'hyphai-interactive hyphai-focus hyphai-touch-cta cursor-pointer rounded-xl bg-gradient-to-b from-emerald-400 to-emerald-600 px-6 py-3 text-sm font-semibold text-emerald-950 shadow-[0_0_28px_rgba(52,211,153,0.35)]'
      : 'hyphai-interactive hyphai-focus cursor-pointer rounded-xl px-4 py-2 text-sm text-zinc-400 hover:text-emerald-300';

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={reduced || disabled ? undefined : { scale: 1.02 }}
      whileTap={reduced || disabled ? undefined : { scale: 0.97 }}
      transition={springSnappy}
      className={`${base} transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {children}
    </motion.button>
  );
}

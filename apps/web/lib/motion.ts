'use client';

import type { Transition, Variants } from 'motion/react';

export const springSnappy: Transition = {
  type: 'spring',
  stiffness: 420,
  damping: 32,
};

export const springSoft: Transition = {
  type: 'spring',
  stiffness: 260,
  damping: 28,
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export const fadeScale: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1 },
};

export const slideRight: Variants = {
  hidden: { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0 },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05, delayChildren: 0.04 },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
};

export const pageTransition: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

export const messageBubble: Variants = {
  hidden: { opacity: 0, y: 14, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1 },
};

export function motionTransition(reduced: boolean): Transition {
  return reduced ? { duration: 0.01 } : springSoft;
}

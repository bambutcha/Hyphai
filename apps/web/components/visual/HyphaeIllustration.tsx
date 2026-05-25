'use client';

import { motion, useReducedMotion } from 'motion/react';
import { springSoft } from '@/lib/motion';

interface HyphaeIllustrationProps {
  className?: string;
}

export function HyphaeIllustration({ className = '' }: HyphaeIllustrationProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className={`relative mx-auto ${className}`}
      initial={reduced ? false : { opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={springSoft}
    >
      <svg
        width="200"
        height="200"
        viewBox="0 0 200 200"
        fill="none"
        className="animate-hyphae-float drop-shadow-[0_0_40px_rgba(52,211,153,0.25)]"
        aria-hidden
      >
        <defs>
          <radialGradient id="hyphae-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#34d399" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="stem" x1="0" y1="0" x2="0" y2="1">
            <stop stopColor="#6ee7b7" />
            <stop offset="1" stopColor="#059669" />
          </linearGradient>
        </defs>
        <circle cx="100" cy="100" r="70" fill="url(#hyphae-glow)" />
        <path
          d="M100 165 C100 165 85 120 70 95 C55 70 45 55 55 40 C65 25 80 35 90 55 C100 75 100 95 100 120 Z"
          fill="url(#stem)"
          opacity="0.9"
        />
        <path
          d="M100 55 C115 45 135 50 140 70 C145 90 130 100 115 95 C100 90 100 75 100 55 Z"
          fill="#34d399"
          opacity="0.7"
        />
        <path
          d="M100 70 C75 65 60 80 55 100 C50 120 65 130 85 125 C105 120 100 95 100 70 Z"
          fill="#10b981"
          opacity="0.5"
        />
        {[
          [100, 40],
          [130, 65],
          [70, 75],
          [115, 110],
          [85, 115],
        ].map(([cx, cy], i) => (
          <g key={i}>
            <line
              x1="100"
              y1="100"
              x2={cx}
              y2={cy}
              stroke="#34d399"
              strokeWidth="0.75"
              opacity="0.4"
            />
            <circle cx={cx} cy={cy} r="4" fill="#6ee7b7" opacity="0.8" />
          </g>
        ))}
      </svg>
    </motion.div>
  );
}

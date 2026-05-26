'use client';

import { motion, useReducedMotion } from 'motion/react';

interface HyphaeGraphEmptyProps {
  onNodeClick?: () => void;
  className?: string;
}

const NODES = [
  { id: 'a', cx: 80, cy: 60, r: 10 },
  { id: 'b', cx: 200, cy: 40, r: 12 },
  { id: 'c', cx: 320, cy: 70, r: 9 },
  { id: 'd', cx: 140, cy: 140, r: 11 },
  { id: 'e', cx: 260, cy: 150, r: 13 },
];

const EDGES: Array<[string, string]> = [
  ['a', 'b'],
  ['b', 'c'],
  ['a', 'd'],
  ['b', 'd'],
  ['b', 'e'],
  ['c', 'e'],
  ['d', 'e'],
];

const nodeById = Object.fromEntries(NODES.map((n) => [n.id, n]));

export function HyphaeGraphEmpty({ onNodeClick, className = '' }: HyphaeGraphEmptyProps) {
  const reduced = useReducedMotion();

  return (
    <div className={`relative mx-auto w-full max-w-md ${className}`}>
      <svg
        viewBox="0 0 400 200"
        className="hyphae-network w-full text-emerald-500/80"
        role="img"
        aria-label="Граф диалогов Hyphai"
      >
        {EDGES.map(([from, to]) => {
          const a = nodeById[from];
          const b = nodeById[to];
          return (
            <motion.line
              key={`${from}-${to}`}
              x1={a.cx}
              y1={a.cy}
              x2={b.cx}
              y2={b.cy}
              stroke="currentColor"
              strokeWidth="1.5"
              strokeOpacity={0.35}
              initial={reduced ? false : { pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.1 }}
            />
          );
        })}
        {NODES.map((node, i) => (
          <motion.g
            key={node.id}
            initial={reduced ? false : { opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 + i * 0.08, type: 'spring', stiffness: 260, damping: 18 }}
            style={{ cursor: onNodeClick ? 'pointer' : undefined }}
            onClick={onNodeClick}
            onKeyDown={(e) => {
              if (onNodeClick && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                onNodeClick();
              }
            }}
            role={onNodeClick ? 'button' : undefined}
            tabIndex={onNodeClick ? 0 : undefined}
          >
            <circle
              cx={node.cx}
              cy={node.cy}
              r={node.r + 8}
              fill="rgb(52 211 153 / 0.08)"
              className={onNodeClick ? 'hover:fill-emerald-500/20' : undefined}
            />
            <circle
              cx={node.cx}
              cy={node.cy}
              r={node.r}
              fill="rgb(16 185 129 / 0.35)"
              stroke="rgb(52 211 153 / 0.6)"
              strokeWidth="1.5"
            />
          </motion.g>
        ))}
      </svg>
    </div>
  );
}

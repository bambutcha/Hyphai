'use client';

import { useEffect, useState } from 'react';

export function HyphaeBackground() {
  const [mouse, setMouse] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setMouse({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div
        className="absolute h-[480px] w-[480px] rounded-full opacity-40 blur-[100px] transition-[left,top] duration-700 ease-out"
        style={{
          left: `${mouse.x}%`,
          top: `${mouse.y}%`,
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(52,211,153,0.18) 0%, transparent 70%)',
        }}
      />
      <svg
        className="hyphae-network absolute inset-0 h-full w-full opacity-[0.22]"
        viewBox="0 0 800 600"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="hyphae-line" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34d399" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#34d399" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#059669" stopOpacity="0.15" />
          </linearGradient>
        </defs>
        {[
          [120, 80, 280, 120],
          [280, 120, 420, 200],
          [420, 200, 620, 140],
          [180, 280, 340, 380],
          [340, 380, 520, 480],
          [100, 400, 260, 520],
          [260, 520, 480, 420],
          [500, 80, 680, 320],
          [200, 180, 380, 260],
        ].map(([x1, y1, x2, y2], i) => (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="url(#hyphae-line)"
            strokeWidth="1"
            strokeDasharray="4 6"
            style={{
              animation: `hyphae-dash 3s ease-in-out ${i * 0.15}s infinite alternate`,
              strokeDashoffset: 20,
            }}
          />
        ))}
        {[
          [120, 80],
          [280, 120],
          [420, 200],
          [620, 140],
          [340, 380],
          [180, 280],
          [260, 520],
          [500, 80],
        ].map(([cx, cy], i) => (
          <circle key={`n-${i}`} cx={cx} cy={cy} r="3" fill="#34d399" opacity="0.5" />
        ))}
      </svg>
    </div>
  );
}

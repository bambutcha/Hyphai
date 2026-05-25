'use client';

import { useEffect, useRef } from 'react';

const LERP = 0.18;

export function HyphaeBackground() {
  const glowRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);
  const reducedRef = useRef(false);
  const trackingRef = useRef(false);

  useEffect(() => {
    const applyTransform = (x: number, y: number) => {
      const el = glowRef.current;
      if (!el) return;
      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    };

    const centerPointer = () => {
      const x = window.innerWidth / 2;
      const y = window.innerHeight / 2;
      targetRef.current = { x, y };
      currentRef.current = { x, y };
      applyTransform(x, y);
    };

    const tick = () => {
      const cur = currentRef.current;
      const tgt = targetRef.current;
      const nx = cur.x + (tgt.x - cur.x) * LERP;
      const ny = cur.y + (tgt.y - cur.y) * LERP;
      currentRef.current = { x: nx, y: ny };
      applyTransform(nx, ny);
      rafRef.current = requestAnimationFrame(tick);
    };

    const startLoop = () => {
      if (rafRef.current != null) return;
      rafRef.current = requestAnimationFrame(tick);
    };

    const stopLoop = () => {
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };

    const onMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
    };

    const enableTracking = () => {
      if (trackingRef.current) return;
      trackingRef.current = true;
      window.addEventListener('mousemove', onMove, { passive: true });
      startLoop();
    };

    const disableTracking = () => {
      if (!trackingRef.current) return;
      trackingRef.current = false;
      window.removeEventListener('mousemove', onMove);
      stopLoop();
      centerPointer();
    };

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncMotionPreference = () => {
      reducedRef.current = mq.matches;
      if (mq.matches) disableTracking();
      else enableTracking();
    };

    const onVisibility = () => {
      if (document.hidden || reducedRef.current) {
        stopLoop();
        return;
      }
      if (trackingRef.current) startLoop();
    };

    centerPointer();
    syncMotionPreference();
    mq.addEventListener('change', syncMotionPreference);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      disableTracking();
      mq.removeEventListener('change', syncMotionPreference);
      document.removeEventListener('visibilitychange', onVisibility);
      stopLoop();
    };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div
        ref={glowRef}
        className="absolute left-0 top-0 h-[480px] w-[480px] rounded-full opacity-40 blur-[100px] will-change-transform"
        style={{
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

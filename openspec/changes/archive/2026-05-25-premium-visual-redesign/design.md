## Context

Hyphai: dark chat, emerald accent, русский UI. Уже есть `ui-text.ts`, empty states, CSS animations. Пользователь хочет **полную** визуальную переработку с мощными анимациями, уровень top SaaS, не нейрослоп.

Референсы по духу (не копировать): Linear (precision), Raycast (glass + contrast), bioluminescent nature (Avatar, organic glow).

## Goals / Non-Goals

**Goals:**

- Узнаваемая визуальная идентичность Hyphai
- Богатый, но производительный motion
- Вау при первом экране и при отправке сообщения
- `prefers-reduced-motion` respected

**Non-goals:**

- Light mode
- WebGL particle systems
- Backend changes

## Decisions

### 1. Motion library: `motion` (Framer Motion v11+)

**Choice:** Add `motion` package for React 19.

**Use cases:**
- `AnimatePresence` — message list, empty ↔ chat transition
- `layoutId` — active chat indicator slide in sidebar
- `staggerChildren` — conversation list, message history
- Spring transitions on send button / composer focus

**Rationale:** CSS alone не даёт layout animations и gesture-quality springs. Industry standard for premium SaaS.

**Bundle:** ~30kb gzip — acceptable for hackathon demo impact.

### 2. Typography

**Choice:**
- **Display/headings:** `Syne` (Google Font) — geometric, distinctive, not Inter
- **Body/UI:** keep `Geist Sans` for readability
- **Mono accents:** `Geist Mono` for timestamps (future)

**Rationale:** One accent font avoids full «custom font» cost while breaking slop look.

### 3. Color & surfaces (CSS variables)

```css
--hyphai-bg-deep: #050506;
--hyphai-surface-1: rgba(24, 24, 27, 0.72);
--hyphai-glow: rgba(52, 211, 153, 0.35);
--hyphai-accent: #34d399;
--hyphai-accent-dim: #059669;
--hyphai-border: rgba(52, 211, 153, 0.12);
```

Glass: `backdrop-blur-xl` + semi-transparent surfaces, thin luminous borders.

### 4. HyphaeBackground component

**Choice:** SVG animated network (nodes + lines) with slow CSS/SVG `stroke-dashoffset` animation + radial glow follow mouse (subtle, desktop only).

**Not:** particle.js, not purple nebula JPG.

### 5. Component architecture

```
components/visual/
  HyphaeBackground.tsx   — global ambient layer
  GlowButton.tsx         — CTA with hover glow
  GlassPanel.tsx         — reusable glass surface
  HyphaeIllustration.tsx — empty state SVG
lib/motion.ts            — shared variants (fadeUp, stagger, spring)
```

### 6. Key screen redesigns

| Screen | Changes |
|--------|---------|
| Auth | Split layout: left hyphae art, right glass form; entrance animation |
| Sidebar | Glass panel, `layoutId` active pill, refined list items |
| MessagePane | Floating composer dock, message bubbles with subtle tail + glow, scroll fade masks |
| Empty | Custom SVG hyphae bloom, parallax-lite float animation |
| ChatApp | Cross-fade between empty variants and chat via AnimatePresence |

### 7. Performance

- `will-change` only during animation
- Disable mouse-follow glow on mobile
- `prefers-reduced-motion`: instant transitions, static background

## Risks / Trade-offs

- **[Risk] motion + RSC** → all animated components stay `'use client'`
- **[Risk] Too busy** → Mitigation: motion choreography guide (max 400ms, ease springs)
- **[Trade-off] Heavier bundle** → acceptable for wow demo

## Migration Plan

1. `bun add motion` in apps/web
2. Ship visual refactor (no API)
3. Rollback: revert web commit

## Open Questions

- Optional: добавить лёгкий **typing indicator** анимацию при `sending` — включить в tasks как polish item

## Why

Текущий UI Hyphai функционален, но визуально близок к типичному «AI slop»: Geist, emerald-on-zinc, emoji-иллюстрации, простые CSS-keyframes. Для хакатона harness engineer нужен **вау-эффект** — ощущение premium SaaS (Linear, Raycast, Vercel), но с уникальной идентичностью **живой грибницы**, а не шаблонным dark-green chat.

## What Changes

- **Design system**: токены (цвет, glow, radius, motion), типографика с характером, grain/noise overlay
- **Motion layer**: `motion` (Framer Motion) — layout transitions, stagger, spring, AnimatePresence для сообщений и empty states
- **Фон и атмосфера**: анимированная hyphae-сеть (SVG/canvas), mesh-glow, без generic purple gradients
- **Shell**: glass-sidebar, sliding active indicator, refined composer «floating dock»
- **Компоненты**: переработка Auth, Sidebar, MessagePane, ChatEmptyState — custom SVG вместо emoji
- **Микро-interactions**: send ripple, hover magnetic buttons, skeleton shimmer, typing indicator placeholder
- Сохранить всю текущую функциональность (auth, rename, empty states, errors)

## Capabilities

### New Capabilities

- `visual-design-system`: токены, типографика, motion primitives, фоновые эффекты

### Modified Capabilities

- `chat-ui`: визуальный стиль и анимации — premium SaaS уровень
- `chat-empty-states`: иллюстрации и motion welcome/pick
- `auth-ui`: визуальное единство с основным приложением

## Impact

- `apps/web/package.json` — dependency `motion`
- `apps/web/app/globals.css`, `layout.tsx` — fonts, tokens
- Новые: `components/visual/`, `lib/motion.ts`
- Рефактор: `AuthScreen`, `ConversationSidebar`, `MessagePane`, `ChatApp`, `ChatEmptyState`, UI primitives
- API без изменений
- 3D WebGL (Three.js)

## Non-goals

- Звуковые эффекты

## Hackathon demo

30 секунд: вход → animated background → stagger sidebar → выбор чата с layout transition → отправка сообщения с spring bubble + glow pulse. Зритель должен сказать «не похоже на шаблонный ChatGPT clone».

## Anti-slop checklist (явные запреты)

- ❌ Emoji как главная иллюстрация
- ❌ Inter/Geist-only без accent font
- ❌ Фиолетово-розовые AI-градиенты
- ❌ Одинаковые rounded cards без иерархии
- ✅ Ограниченная палитра, световые акценты, organic lines, spring motion

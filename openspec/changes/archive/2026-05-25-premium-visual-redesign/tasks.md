## 1. Design system foundation

- [x] 1.1 `bun add motion` в apps/web
- [x] 1.2 CSS tokens + grain overlay в `globals.css`
- [x] 1.3 Подключить Syne в `layout.tsx`, создать `lib/motion.ts` (variants)
- [x] 1.4 `HyphaeBackground.tsx`, `GlassPanel.tsx`, `GlowButton.tsx`

## 2. Visual components

- [x] 2.1 `HyphaeIllustration.tsx` — SVG для empty states
- [x] 2.2 Переработать `ChatEmptyState` с motion + illustration
- [x] 2.3 Переработать `AuthScreen` — glass + background + entrance motion

## 3. Chat shell

- [x] 3.1 `ChatApp` — HyphaeBackground, AnimatePresence empty↔chat
- [x] 3.2 `ConversationSidebar` — glass, layoutId active indicator, stagger
- [x] 3.3 `MessagePane` — floating composer, bubble redesign, message AnimatePresence

## 4. Polish & a11y

- [x] 4.1 `prefers-reduced-motion` во всех motion-компонентах
- [x] 4.2 Sending state: кнопка + опциональный typing indicator pulse
- [x] 4.3 Scroll fade masks в ленте сообщений

## 5. Verification

- [x] 5.1 `bun run build` проходит
- [x] 5.2 Визуально: нет emoji-hero, есть glass/spring/layout transition
- [x] 5.3 Hackathon path: login → welcome → create chat → send message — wow flow

## 1. Parallax performance

- [x] 1.1 Переписать `HyphaeBackground`: rAF + ref, `transform` вместо `left/top` + state
- [x] 1.2 Убрать `transition` 700ms на glow; лёгкий lerp в rAF (опционально)
- [x] 1.3 `prefers-reduced-motion`: не слушать mousemove, статичный glow

## 2. Interaction utilities

- [x] 2.1 Добавить в `globals.css`: `.hyphai-interactive`, `.hyphai-focus`, `button:not(:disabled) { cursor: pointer }`
- [x] 2.2 Обновить `GlowButton` — pointer, focus-visible, disabled cursor

## 3. Component pass

- [x] 3.1 `ConversationSidebar` — pointer/hover/focus на строках и icon buttons
- [x] 3.2 `MessagePane`, `AuthScreen`, `ChatEmptyState`, `ErrorBanner` — interactive classes
- [x] 3.3 Touch targets ≥44px на mobile для primary CTA

## 4. Verification

- [x] 4.1 `bun run build` проходит
- [x] 4.2 Ручной чек: parallax без лага, pointer на всех кнопках, Tab focus visible
- [x] 4.3 Зафиксировать в README или comment backlog оставшихся SaaS items (toasts, drawer, ⌘K)

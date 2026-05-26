## 1. Foundation — viewport & safe area

- [x] 1.1 `layout.tsx`: export `viewport` с `viewportFit: 'cover'`
- [x] 1.2 `globals.css`: `--hyphai-safe-*` tokens, `overflow-x: hidden` на html/body
- [x] 1.3 Utility classes: `pb-safe`, `pt-safe` для composer/toast/hamburger

## 2. Chat shell

- [x] 2.1 `ChatApp`: safe-area на hamburger; empty state padding-top под кнопку меню
- [x] 2.2 `MessagePane`: двухрядная шапка на `<md`; composer `pb-safe`
- [x] 2.3 `ModelSelector`: `w-full max-w-full` на mobile
- [x] 2.4 `ToastProvider`: `bottom` с safe-area inset
- [x] 2.5 Пузыри: проверить `overflow-wrap`, max-width на narrow
- [x] 2.6 **Адаптация кнопок копирования, ветки, share**: на мобильном устройстве эти кнопки залезают на текст сообщения.

## 3. Остальные экраны

- [x] 3.1 `LandingPage`: mobile typography/padding/grid
- [x] 3.2 `AuthScreen`: padding + CTA touch height
- [x] 3.3 `ShareDialog` + `share/[slug]/page`: mobile full-width, scroll, safe padding
- [x] 3.4 `ConversationSidebar`: touch targets delete/rename/logout на mobile

## 4. Verification

- [x] 4.1 `bun run --filter @hyphai/web build`
- [x] 4.2 DevTools 320×568, 390×844 — нет horizontal scroll; fork/send/menu работают
- [x] 4.3 Desktop 1280px — без регрессии drawer/header

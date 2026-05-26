## Why

Базовый mobile drawer уже есть, но на узких экранах (<390px) и на iOS/Android ломается UX: переполнение шапки чата (модель, share, badge), composer перекрывается home indicator, landing/auth не учитывают safe-area, горизонтальный скролл. Нужен **полный** мобильный адаптив всех публичных экранов, а не только сайдбар.

## What Changes

- **Safe area & viewport**: `viewport-fit=cover`, CSS-переменные `env(safe-area-inset-*)`, padding для fixed UI (composer, toasts, hamburger).
- **Chat header mobile**: двухрядная шапка на `<md` — заголовок + меню сверху; модель/share/badge на второй строке или в переносимой панели без overflow.
- **Composer**: липкий низ с `safe-area-inset-bottom`, кнопка «Отправить» не сжимается; input `min-width: 0`.
- **ModelSelector**: на mobile — на всю ширину второй строки или `max-w-full`.
- **Landing / Auth / Share**: отступы, типографика, CTA ≥44px, без горизонтального скролла.
- **Modals**: ShareDialog на mobile — почти fullscreen, кнопки stack.
- **Touch**: все primary/secondary actions в чате ≥44px hit-area на `<md`.
- **Регрессия desktop**: без изменений layout ≥768px.
- **Адаптация кнопок копирования, ветки, share**: на мобильном устройстве эти кнопки залезают на текст сообщения.

## Capabilities

### New Capabilities

_(нет отдельных capability — расширяем mobile-shell и связанные UI specs)_

### Modified Capabilities

- `mobile-shell`: safe-area, покрытие всех экранов приложения, composer/toast/hamburger.
- `chat-ui`: полная адаптивность MessagePane, composer, пузырей, шапки.
- `landing-page`: mobile layout hero/features/CTA.
- `auth-ui`: mobile layout формы входа/регистрации.
- `ui-interaction`: расширение touch-target на действия в ленте (копировать, ветка, share).

## Impact

- `apps/web/app/layout.tsx`, `globals.css`
- `ChatApp`, `MessagePane`, `ModelSelector`, `ConversationSidebar`
- `LandingPage`, `AuthScreen`, `ShareDialog`, `app/share/[slug]/page.tsx`
- `ToastProvider`
- Без изменений API

## Non-goals

- Отдельное нативное приложение (Capacitor)
- Tablet-only layout (768–1024) — достаточно md/lg breakpoints
- PWA manifest / install prompt
- Горизонтальная ориентация как отдельный дизайн (только «не ломается»)

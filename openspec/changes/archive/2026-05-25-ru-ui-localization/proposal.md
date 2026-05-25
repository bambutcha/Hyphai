## Why

Auth и ошибки уже частично на русском, но основной интерфейс чата (сайдбар, сообщения, кнопки, пустые состояния, meta title) всё ещё на английском. Для хакатона и целевой аудитории нужен единый русскоязычный UI без переключателя языков.

## What Changes

- Централизованный словарь UI-строк на русском (`apps/web/lib/ui-text.ts`)
- Перевод всех user-facing строк в `ConversationSidebar`, `MessagePane`, `ConnectionBadge` (уже частично), `layout.tsx`
- Обновление сценариев в spec `chat-ui`: «New chat» → «Новый чат», «Send» → «Отправить», «Retry» → «Повторить» и т.д.
- Русский echo-ответ assistant (текст заглушки LLM) — опционально через API
- `aria-label` и placeholder — на русском где это не ломает UX (email можно оставить)

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `chat-ui`: все видимые пользователю строки интерфейса чата — на русском
- `messages`: текст echo-ответа assistant — на русском (user-visible content)

## Impact

- `apps/web/lib/ui-text.ts` — новый файл со строками
- `apps/web/components/ConversationSidebar.tsx`, `MessagePane.tsx`, `app/layout.tsx`
- `apps/api/src/routes/conversations.ts` — русский текст echo (1 строка)
- Без новых зависимостей, без i18n-фреймворка

## Non-goals

- react-intl / next-intl / переключатель EN/RU
- Локализация API error JSON на бэкенде (уже маппится на фронте)
- Перевод названия бренда **Hyphai**
- Перевод технических логов, README, OpenSpec-артефактов
- Локализация Grafana/Prometheus

## Hackathon demo

Показать: после входа весь UI на русском — «Новый чат», «Отправить», «Выберите диалог», русский ответ assistant-echo.

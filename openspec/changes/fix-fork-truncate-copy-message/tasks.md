## 1. API — исправление fork

- [x] 1.1 В `POST /:id/fork`: загрузить сообщения `ORDER BY created_at ASC, id ASC`
- [x] 1.2 Найти индекс `messageId`; если не найден — 404
- [x] 1.3 Копировать `messages.slice(0, index + 1)` в новый диалог (не `created_at <=`)
- [x] 1.4 Ручная проверка: чат 4+ сообщений → ветка со 2-го → в новом чате 2 сообщения

## 2. Web — копирование сообщения

- [x] 2.1 `ui-text.ts`: строки copy success/error/aria
- [x] 2.2 `MessagePane`: кнопка «Копировать» на пузыре (рядом с «Ветка»), `navigator.clipboard.writeText`
- [x] 2.3 Toast success/error через `useToast`
- [x] 2.4 Проверка на desktop и narrow viewport (touch target ≥ 44px при необходимости)

## 3. Verification

- [x] 3.1 `bun run --filter @hyphai/api typecheck` и `bun run --filter @hyphai/web build`
- [x] 3.2 Demo: fork до середины чата + copy assistant ответа

## 1. API: переименование

- [x] 1.1 Добавить `PATCH /api/conversations/:id` с валидацией title (1–120 символов)
- [x] 1.2 Дефолтный title при создании: «Новый диалог»
- [x] 1.3 `api.updateConversation(id, title)` в `apps/web/lib/api.ts`

## 2. Empty states

- [x] 2.1 Создать `ChatEmptyState.tsx` (variants: welcome, pick)
- [x] 2.2 Обновить `ChatApp`: рендерить MessagePane только при `activeId`
- [x] 2.3 Добавить строки в `ui-text.ts`

## 3. Визуальный polish

- [x] 3.1 CSS keyframes в `globals.css` (fade-in, message-in, reduced-motion)
- [x] 3.2 Улучшить `ConversationSidebar` — card style, hover, stagger
- [x] 3.3 Улучшить `MessagePane` — bubbles, gradient background, send button motion

## 4. Переименование в UI

- [x] 4.1 Inline rename в сайдбаре (double-click / Enter / Escape)
- [x] 4.2 Обновление title в header MessagePane после save

## 5. Проверка

- [x] 5.1 Нет диалогов → welcome, без disabled input
- [x] 5.2 Есть диалоги, none selected → pick empty state
- [x] 5.3 Rename сохраняется после refresh
- [x] 5.4 `bun run build` (web) проходит

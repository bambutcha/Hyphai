## 1. Словарь UI-строк

- [x] 1.1 Создать `apps/web/lib/ui-text.ts` с русскими строками (sidebar, messages, meta, a11y)

## 2. Компоненты web

- [x] 2.1 Подключить `uiText` в `ConversationSidebar.tsx`
- [x] 2.2 Подключить `uiText` в `MessagePane.tsx`
- [x] 2.3 Обновить `app/layout.tsx` — title и description на русском

## 3. API echo

- [x] 3.1 Перевести echo-ответ assistant в `apps/api/src/routes/conversations.ts`

## 4. Проверка

- [x] 4.1 UI после входа — нет английских кнопок/placeholder (кроме «Email», «Hyphai»)
- [x] 4.2 Отправка сообщения — echo assistant на русском
- [x] 4.3 `bun run build` в apps/web проходит

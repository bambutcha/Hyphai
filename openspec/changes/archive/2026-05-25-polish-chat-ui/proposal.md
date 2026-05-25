## Why

Интерфейс Hyphai функционален, но выглядит «сыро»: при отсутствии или невыбранном диалоге показывается неактивная панель чата с disabled-полем ввода — это путает. Нет переименования диалогов. Визуал и motion не дотягивают до «живой сети грибницы» для демо хакатона harness engineer.

## What Changes

- **Empty states**: отдельные полноэкранные/центрированные экраны вместо пустого MessagePane с disabled input
- **Переименование чатов**: PATCH API + inline-редактирование в сайдбаре
- **Визуальный polish**: градиенты hyphae, улучшенная типографика, иконки, hover/focus states
- **Анимации**: появление сообщений, переходы empty↔chat, stagger списка диалогов, micro-interactions кнопок (CSS/Tailwind)
- **Дефолтный title** нового диалога на русском («Новый диалог»)
- Полный редизайн auth-экрана (минимальные согласованные правки допустимы)
- Framer Motion / тяжёлые UI-библиотеки (CSS + Tailwind)
- Drag-and-drop сортировка диалогов
- Аватары, реакции, markdown в сообщениях
- Мобильный drawer-сайдбар (улучшим стили, без новой навигации)

## Capabilities

### New Capabilities

- `chat-empty-states`: UI для «нет диалогов» и «диалог не выбран»

### Modified Capabilities

- `chat-ui`: визуальный стиль, анимации, область сообщений только при выбранном диалоге
- `conversations`: PATCH переименование диалога

## Impact

- `apps/api` — `PATCH /api/conversations/:id`
- `apps/web` — новые компоненты `ChatEmptyState`, обновление `ChatApp`, `ConversationSidebar`, `MessagePane`, `globals.css`
- `apps/web/lib/api.ts`, `ui-text.ts` — метод rename, новые строки


## Hackathon demo

Показать: пустой аккаунт → красивый welcome с CTA «Новый чат»; есть чаты, ничего не выбрано → иллюстрация «Выберите диалог»; rename по клику; плавное появление сообщений.

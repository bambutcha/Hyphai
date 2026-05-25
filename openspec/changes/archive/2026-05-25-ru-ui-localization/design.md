## Context

После changes `error-handling-ui` и `ru-auth-validation` на русском: ошибки, auth-форма, «Повторить», «Загрузка…». На английском остаются:

- Sidebar: `+ New chat`, `No conversations yet`, tagline
- MessagePane: `Select a conversation`, `Send`, placeholders
- `layout.tsx`: title/description
- API echo: `Hyphai received: ... connect an LLM harness...`
- Main spec `chat-ui` всё ещё ссылается на английские лейблы в сценариях

## Goals / Non-Goals

**Goals:**

- Единый источник UI-строк на русском
- Все видимые строки чата переведены
- Spec синхронизирован с реальными лейблами

**Non-goals:**

- i18n framework
- Динамический выбор языка

## Decisions

### 1. `lib/ui-text.ts` — константы, не i18n

**Choice:** Экспорт объекта `uiText` с группами `sidebar`, `messages`, `meta`, `a11y`.

**Rationale:** Минимальный diff; один файл для review; без over-engineering. Позже можно заменить на i18n.

**Alternative:** Inline strings в компонентах — отклонено (дублирование, сложнее поддерживать).

### 2. Пример словаря

```typescript
export const uiText = {
  sidebar: {
    tagline: 'Универсальный чат · живая сеть',
    newChat: 'Новый чат',
    empty: 'Пока нет диалогов',
    deleteAria: 'Удалить диалог',
  },
  messages: {
    selectConversation: 'Выберите диалог',
    emptyHint: 'Создайте или выберите чат, чтобы начать переписку',
    placeholder: 'Введите сообщение…',
    placeholderNoChat: 'Сначала выберите чат',
    send: 'Отправить',
  },
  meta: {
    title: 'Hyphai — универсальный чат',
    description: 'Универсальный чат как живая сеть. OpenSpec harness.',
  },
} as const;
```

### 3. Echo-ответ на API

**Choice:** Изменить строку в `conversations.ts` на русский:

`Hyphai получил: «…» — подключите LLM harness для настоящих ответов.`

**Rationale:** Сообщение видно пользователю в bubble assistant; входит в «весь UI».

### 4. Spec updates

**Choice:** MODIFIED requirements в delta `chat-ui` — обновить сценарии с английских лейблов на русские; ADDED requirement «Русский интерфейс чата».

## Risks / Trade-offs

- **[Risk] Spec drift** → Mitigation: ui-text.ts как single source, spec ссылается на русские лейблы
- **[Trade-off] Email placeholder** → оставляем «Email» (международно узнаваемо)

## Migration Plan

Frontend + одна строка API. Redeploy web (+ api если echo). Rollback — revert commit.

## Open Questions

(none)

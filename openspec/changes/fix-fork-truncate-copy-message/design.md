## Context

Fork реализован в `POST /api/conversations/:id/fork` с телом `{ messageId }`. Сейчас история отбирается условием `created_at <= anchor.created_at`. В PostgreSQL `TIMESTAMPTZ` для сообщений, созданных в одной транзакции или с одинаковым default, может совпадать — тогда в ветку попадают **все** сообщения с тем же timestamp, т.е. весь чат.

Копирование текста отсутствует; пользователи на мобильных страдают сильнее.

## Goals / Non-Goals

**Goals:**

- Fork включает только сообщения от начала ленты до выбранного **включительно**, в каноническом порядке ленты.
- Кнопка «Копировать» на пузыре → `navigator.clipboard.writeText(content)` + toast.

**Non-Goals:**

- Markdown/HTML в буфере, fork на share-странице, дерево веток в UI.

## Decisions

### 1. Граница fork по индексу в упорядоченном списке

**Решение:** загрузить все сообщения диалога `ORDER BY created_at ASC, id ASC`, найти индекс `messageId`, скопировать `slice(0, index + 1)`.

**Почему не только `created_at`:** детерминированный порядок при коллизиях timestamp; `id` (UUID v4) как tie-breaker стабилен.

**Альтернатива:** SQL `ROW_NUMBER()` — избыточно для MVP; slice в приложении проще тестировать.

### 2. Ответ API fork

**Решение:** без breaking change — тот же `201` + conversation; опционально в теле `messagesCopied: number` для отладки (не обязательно в UI).

### 3. Копирование в UI

**Решение:** иконка/кнопка «Копировать» рядом с «Ветка» в `group-hover/bubble`; `useToast` для success/error; aria-label на русском.

**Fallback:** если `clipboard` API недоступен (не secure context) — toast error с подсказкой.

### 4. Plain text

Копируем `message.content` как есть (markdown source), не rendered HTML.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Очень длинные чаты — загрузка всех сообщений для fork | Приемлемо для MVP; позже — SQL subquery с LIMIT |
| Дубликаты при повторном fork | Ожидаемое поведение — новый диалог каждый раз |
| Clipboard denied | Toast + не падать |

## Migration Plan

Только deploy API + web; миграций БД нет. Существующие ветки с лишней историей не мигрируем.

## Open Questions

- Нужен ли e2e-тест fork в CI — опционально, ручная проверка в tasks достаточна для этого change.

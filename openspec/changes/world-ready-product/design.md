## Context

Текущий flow: `POST /messages` блокируется до полного ответа LLM; UI показывает `sending` и затем пару bubble. WebSocket шлёт `messages.created` после сохранения обоих сообщений. Landing отсутствует — `/` сразу Auth/ChatApp.

Цель: продукт, который выглядит как ChatGPT-класс за 60 секунд демо, и дорожная карта до «живой сети».

## Goals / Non-Goals

**Goals (по волнам):**

- A: streaming + markdown + landing + mobile drawer
- B: polish + transparency + CI/deploy + stable LLM
- C: branches, share, graph empty state

**Non-Goals:** см. proposal; волна C не обязательна для первого archive.

## Decisions

### 1. Streaming transport (Волна A)

**Решение:** `POST /conversations/:id/messages/stream` возвращает `text/event-stream` (SSE).

События:

```
event: user_message
data: { message }

event: chunk
data: { delta: "..." }

event: done
data: { assistant: Message, modelUsed, fallbackFrom? }

event: error
data: { error }
```

**Альтернатива:** WebSocket stream — сложнее с текущим hub; SSE проще для Hono+Bun.

**Flow:**

1. Сохранить user message
2. OpenRouter `stream: true` → читать chunks
3. По завершении — insert assistant, WS `messages.created`, SSE `done`

Старый non-stream `POST` оставить для совместимости или deprecate в B.

### 2. Markdown (Волна A)

**Решение:** `react-markdown` + `remark-gfm`, стили в `globals.css` под `.message-markdown`.

Только assistant bubbles (user — plain или тоже md — опционально phase A).

Sanitize: `rehype-sanitize` или ограниченный allowlist.

### 3. Landing (Волна A)

**Решение:** `app/page.tsx` — если не authed → `<LandingPage />`, иначе `<ChatApp />` (или route group).

3 секции: Hero (Hyphai + hyphae visual), Features (3 cards), CTA → существующий AuthScreen inline или `/login`.

Скрин: компонент `LandingPreview` — mock чата или screenshot static.

### 4. Mobile drawer (Волна A)

**Решение:** `<768px` — sidebar hidden; hamburger в header MessagePane/ChatApp; `motion` AnimatePresence slide-in overlay; backdrop click закрывает.

### 5. Toasts + skeleton (Волна B)

**Решение:** лёгкий `ToastProvider` + `useToast()` без тяжёлой lib; skeleton — CSS shimmer classes в `globals.css`, замена `LoadingState` в списках.

### 6. Model transparency (Волна B)

API `done` payload:

```json
{
  "assistant": { ... },
  "modelUsed": "openai/gpt-oss-120b:free",
  "requestedModel": "google/gemma-4-26b-a4b-it:free",
  "usedFallback": true
}
```

UI: мелкий бейдж под последним assistant bubble или в header.

### 7. Hyphae network (Волна C)

**Ветки:** `conversations.parent_id` nullable FK; action «Ответить в новой ветке» на message.

**Share:** `conversations.share_slug` + `GET /share/:slug` public read-only (без auth) — security: opt-in, no PII in slug.

**Graph empty:** SVG/canvas nodes из `HyphaeBackground` patterns, анимация на welcome; клик → create chat.

```
┌─────────────┐     fork      ┌─────────────┐
│ Conversation│──────────────▶│  Branch     │
│     A       │               │  (parent)   │
└─────────────┘               └─────────────┘
       │
       └── share_slug ──▶ public read-only view
```

## Risks / Trade-offs

- **[Risk]** SSE + WS дублирование — **Mitigation:** UI слушает SSE при активной отправке; WS для других вкладок
- **[Risk]** Stream обрыв — **Mitigation:** partial assistant save или discard + error toast
- **[Risk]** Волна C schema migration — **Mitigation:** отдельная миграция, feature flag
- **[Trade-off]** Два POST endpoints (stream vs sync) — документировать, позже unify

## Migration Plan

1. A: stream endpoint + web client + landing + drawer
2. B: toasts, skeleton, badge, CI, README deploy
3. C: migration parent_id, share, graph component

## Open Questions

- Deprecate non-stream POST сразу в A или в B? **Предложение:** оставить оба в A, UI переключить на stream only.
- Публичный share без auth — нужен ли модерация? **C: только owner может создать share link.**

## Context

`POST /:id/messages` сохраняет user message, затем синхронно вставляет assistant с фиксированным echo-текстом. Web уже ждёт `{ user, assistant }` и показывает `sending` до ответа API — подходит для блокирующего LLM-вызова (латентность 2–15 с на free tier).

OpenRouter: OpenAI-compatible chat completions, бесплатно через `openrouter/free` или `model:free`. Лимиты free plan (~50 req/day без credits) — для хакатона достаточно с документацией.

## Goals / Non-Goals

**Goals:**

- Реальные ответы assistant через OpenRouter free model
- Ключ только на сервере (`OPENROUTER_API_KEY`)
- Русский system prompt, контекст последних сообщений диалога
- Понятные ошибки при отсутствии ключа, rate limit, timeout

**Non-Goals:**

- Streaming, UI picker модели, multi-provider

## Decisions

### 1. HTTP-клиент без новой зависимости

**Решение:** `fetch` в `apps/api/src/llm/openrouter.ts` (Bun native).

**Альтернатива:** `openai` SDK — лишняя зависимость для одного endpoint.

### 2. Модель по умолчанию

**Решение:** `OPENROUTER_MODEL=openrouter/free` — авто-выбор free-модели OpenRouter.

**Альтернатива:** `meta-llama/llama-3.2-3b-instruct:free` — фиксированная, но может быть недоступна.

### 3. Контекст истории

**Решение:** последние **20** сообщений (user/assistant), без system rows в БД; system prompt добавляется в запрос.

Порядок: ascending `created_at` как в API list.

### 4. System prompt

```text
Ты — Hyphai, ассистент в чате о живых сетях разговоров и грибнице (hyphae).
Отвечай на русском, кратко и по делу, дружелюбно. Не выдумывай факты.
```

### 5. Поток отправки сообщения

```
1. Validate user message → insert user row
2. Load history (limit 20) + append new user message
3. callOpenRouter(messages) → content string
4. insert assistant row
5. update conversation.updated_at
6. publish WS messages.created
7. return { user, assistant }
```

При ошибке шага 3: **не** сохранять assistant; user message остаётся (можно retry send). HTTP **502** `{ error: "LLM unavailable" }` или русский ключ для локализации.

**Альтернатива:** rollback user message — хуже UX при retry.

### 6. Отсутствие API key

`OPENROUTER_API_KEY` пуст → **503** `{ error: "LLM not configured" }` — не silent fallback на echo (явная конфигурация для harness demo).

### 7. Таймаут

`OPENROUTER_TIMEOUT_MS=60000` (default 60s) — `AbortSignal.timeout`.

### 8. Ошибки OpenRouter

| Код OR | HTTP API | error key |
|--------|----------|-----------|
| 401 | 503 | LLM not configured / invalid key |
| 429 | 502 | LLM rate limited |
| timeout | 504 | LLM timeout |
| other | 502 | LLM unavailable |

Frontend: добавить ключи в `errors.ts`.

### 9. Заголовки OpenRouter

```
Authorization: Bearer ${OPENROUTER_API_KEY}
HTTP-Referer: https://hyphai.local (или env OPENROUTER_APP_URL)
X-Title: Hyphai
```

## Risks / Trade-offs

- **[Risk]** Free tier rate limit на демо → **Mitigation:** документировать лимит; опционально `OPENROUTER_MODEL` в .env
- **[Risk]** Долгий ответ блокирует HTTP → **Mitigation:** sending UI уже есть; timeout 60s
- **[Risk]** Модель отвечает на английском → **Mitigation:** system prompt RU + проверка на демо
- **[Trade-off]** User message без assistant при ошибке LLM — пользователь видит только своё сообщение до retry

## Migration Plan

1. Добавить env в `.env.example`
2. Реализовать `llm/openrouter.ts`
3. Подключить в `conversations.ts`
4. Локализация ошибок web
5. README + smoke test с ключом

Rollback: revert API route → echo (archive spec rollback).

## Open Questions

- Нужен ли fallback echo при `LLM unavailable` для offline demo? **По умолчанию нет** — только явная ошибка.

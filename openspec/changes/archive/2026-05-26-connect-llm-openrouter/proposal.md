## Why

Сейчас Hyphai отвечает echo-заглушкой — это блокер для демо harness engineer и реального чата. OpenRouter даёт **бесплатные модели** (`openrouter/free` или `*:free`) с OpenAI-совместимым API — можно подключить LLM без своего GPU и без платных ключей (в рамках лимитов free tier).

## What Changes

- Клиент OpenRouter в API: `POST https://openrouter.ai/api/v1/chat/completions`
- Env: `OPENROUTER_API_KEY`, `OPENROUTER_MODEL` (default `openrouter/free`)
- При отправке сообщения: собрать историю диалога → system prompt Hyphai (RU) → вызов LLM → сохранить ответ `assistant`
- Убрать echo-заглушку; при сбое LLM — HTTP 502/503 с `{ error }` на русском/локализуемом ключе
- Таймаут и лимит истории (последние N сообщений) для free tier
- `.env.example`, README: как получить ключ OpenRouter
- Web: маппинг новых кодов ошибок LLM в `errors.ts` (уже есть sending state)

## Capabilities

### New Capabilities

- `llm-openrouter`: интеграция с OpenRouter, free-модели, конфиг, промпт, обработка ошибок
- Streaming ответа (SSE)
- Выбор модели в UI
- Очередь RabbitMQ для LLM

### Modified Capabilities

- `messages`: ответ ассистента через LLM вместо echo-заглушки
- `chat-ui`: сценарий ошибки недоступности LLM / долгой генерации (существующий sending + banner)

## Impact

- `apps/api` — новый модуль `src/llm/`, правка `routes/conversations.ts`
- `.env.example`, `docker-compose` env (опционально)
- `apps/web/lib/errors.ts` — строки для LLM-ошибок
- PostgreSQL schema без изменений
- WebSocket flow без изменений (по-прежнему `messages.created` после сохранения пары user+assistant)

## Non-goals

- Tool calling / RAG / embeddings
- Платные модели OpenRouter (только free по умолчанию)
- Логирование промптов в Grafana (минимальные метрики — опционально позже)

## Hackathon demo

Войти → новый диалог → «Привет, что такое мицелий?» → через 2–5 с осмысленный ответ assistant на русском (не echo).

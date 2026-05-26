## Why

Hyphai уже силён как harness-MVP (auth, LLM, premium UI, OpenSpec), но для показа **всему миру** не хватает ощущения «настоящего продукта»: стриминг ответа, markdown, landing, мобильный shell, публичный деплой и задел под метафору «живой сети». Этот change формализует дорожную карту в три волны с приоритетом **A → B → C**.

## What Changes

### Волна A — «вау за 60 секунд»

- **Streaming LLM**: SSE или chunked stream от API → посимвольное/по-чанковое появление ответа в UI
- **Markdown в bubble**: рендер assistant (и опционально user) — параграфы, code, списки
- **Landing `/`**: 3 блока (hero, возможности, CTA), скрин/иллюстрация hyphae, кнопка «Войти» → auth
- **Mobile drawer**: off-canvas сайдбар на `<768px`, overlay, жест закрытия

### Волна B — «верят, что это продукт»

- **Toasts**: success/error без только ErrorBanner
- **Skeleton loaders**: shimmer для списка чатов и ленты сообщений
- **Индикатор модели**: какая модель ответила; если был fallback — показать прозрачно
- **Stable LLM path**: env `OPENROUTER_MODEL` paid/стабильная + документация для публичного инстанса

### Волна C — «живая сеть» (vision)

- **Ветки диалога**: fork сообщения → новый диалог с parent_id (или thread_id)
- **Share**: read-only ссылка на диалог (token/slug)
- **Graph empty state**: визуализация hyphae-графа на welcome (интерактивный или SVG+css)

## Capabilities

### New Capabilities

- `streaming-chat`: API stream + UI consumption, совместимость с WS
- `message-markdown`: рендер markdown/code в MessagePane
- `landing-page`: маркетинговая страница до auth
- `mobile-shell`: drawer navigation на mobile
- `product-feedback`: toasts + skeleton loading states
- `llm-transparency`: бейдж модели и fallback в UI/API metadata
- `deploy-ci`: CI workflow + deploy guide + stable LLM config
- `hyphae-network`: ветки, share, graph empty state (волна C)

### Modified Capabilities

- `messages`: streaming endpoint, сохранение assistant после stream complete
- `chat-ui`: landing route, drawer, toasts, skeleton, model badge
- `llm-openrouter`: stream API OpenRouter, metadata `modelUsed` / `fallbackFrom`
- `chat-empty-states`: graph variant для welcome (волна C)
- `conversations`: parent_id / share slug (волна C)

## Impact

- `apps/api` — streaming route, conversation schema migration (C), share tokens (C)
- `apps/web` — landing page, markdown lib, drawer, toasts, skeleton, stream client
- `.github/workflows`, README, docker-compose prod notes
- Новые deps: возможно `react-markdown`, `remark-gfm`, toast lib или свой minimal

## Non-goals

- Полный i18n EN (отдельный change)
- OAuth / email verify (отдельный change)
- RAG, file upload, multi-user realtime collab
- Kafka/RabbitMQ job queue (пока sync/stream достаточно)
- **Волна C не блокирует релиз A+B** — можно archive после A+B с C в backlog

## Hackathon / demo script (60 сек)

1. Открыть landing → «Попробовать»
2. Войти → новый чат → вопрос про мицелий
3. Ответ **стримится**, markdown с кодом/списком
4. На mobile — drawer, на desktop — сайдбар
5. Бейдж: «Gemma 4 → GPT-OSS (fallback)»

## Implementation order

```
Волна A (apply first) ──▶ Волна B ──▶ Волна C (vision)
     streaming              toasts      branches
     markdown               CI          share
     landing                deploy      graph UI
     drawer                 model badge
```

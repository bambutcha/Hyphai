# Hyphai

**Universal chat as a living network** — Spec-Driven Development + full Docker stack.

## Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 16, React, TypeScript, Tailwind |
| Backend | Hono on Bun |
| Database | PostgreSQL + Kysely |
| Cache / PubSub | Redis (WebSocket fan-out) |
| Observability | Prometheus + Grafana |
| Harness | OpenSpec |

## Quick start (Docker — всё сразу)

```bash
cp .env.example .env
docker compose up --build -d
```

| Service | URL |
|---|---|
| Web | http://localhost:3000 |
| API | http://localhost:3001 |
| Prometheus | http://localhost:9090 |
| Grafana | http://localhost:3002 (admin / admin) |

## Local dev (без Docker для web/api)

```bash
docker compose up -d postgres redis
cp .env.example .env
echo 'NEXT_PUBLIC_API_URL=http://localhost:3001' > apps/web/.env.local
echo 'NEXT_PUBLIC_WS_URL=ws://localhost:3001' >> apps/web/.env.local

bun install
bun run db:migrate
bun run dev:api   # :3001
bun run dev:web   # :3000
```

Postgres в dev-compose на порту **5433** (если только postgres/redis подняты — см. `.env.example`).

## LLM (OpenRouter)

1. Зарегистрируйтесь на [openrouter.ai](https://openrouter.ai/) и создайте API key.
2. В корневой `.env` (скопируйте из `.env.example`):

```bash
OPENROUTER_API_KEY=sk-or-v1-...
OPENROUTER_MODEL=openai/gpt-oss-120b:free   # default; в UI: GPT-OSS, Gemma 4, DeepSeek, Nemotron, Авто
```

Free tier имеет лимиты (~50 req/день без credits). Без ключа API вернёт `503` с `LLM not configured`.

При **429** у выбранной модели (Gemma, DeepSeek, Qwen, Llama) API автоматически пробует запасные: `gpt-oss-120b` → `liquid/lfm-2.5-instruct`. В UI отображается бейдж fallback (`Запрошено: … · ответил: …`).

### Production / публичный инстанс

Для стабильного публичного деплоя **не полагайтесь только на `openrouter/free`** — лимиты free tier часто дают 429.

| Режим | `OPENROUTER_MODEL` | Комментарий |
|---|---|---|
| Dev / демо | `openai/gpt-oss-120b:free` | Подходит для локальной разработки |
| Стабильнее free | `openai/gpt-oss-120b:free` + credits на [openrouter.ai](https://openrouter.ai/credits) | Меньше 429 на популярных моделях |
| Production | Платная или лимитированная модель, напр. `anthropic/claude-sonnet-4` | Задайте в `.env` и при необходимости скройте free-модели в UI |

Пользовательский выбор модели в UI по-прежнему может отличаться от `OPENROUTER_MODEL` (дефолт сервера).

## Deploy in 5 min

1. **Fork / clone** репозиторий, скопируйте `.env.example` → `.env`.
2. Задайте секреты:

| Переменная | Обязательно | Описание |
|---|---|---|
| `DATABASE_URL` | ✅ | Postgres (managed или `docker compose`) |
| `REDIS_URL` | ✅ | Redis для WebSocket pub/sub |
| `JWT_SECRET` | ✅ | Случайная строка ≥ 32 символов |
| `OPENROUTER_API_KEY` | ✅ | Ключ OpenRouter |
| `OPENROUTER_MODEL` | рекомендуется | Дефолтная модель (см. таблицу выше) |
| `NEXT_PUBLIC_API_URL` | ✅ | Публичный URL API, напр. `https://api.example.com` |
| `NEXT_PUBLIC_WS_URL` | ✅ | `wss://api.example.com` |
| `PUBLIC_WEB_URL` | для share | Публичный URL web, напр. `https://app.example.com` |
| `CORS_ORIGINS` | ✅ | Origin фронтенда через запятую |

3. **Миграции:** `bun run db:migrate` (или через entrypoint контейнера API).
4. **Запуск:** `docker compose up --build -d` или два сервиса (web + api) за reverse proxy.
5. Откройте web URL, зарегистрируйтесь, создайте чат.

| Сервис | Типичный URL |
|---|---|
| Web | `https://app.example.com` |
| API | `https://api.example.com` |
| Health | `GET /health` |

CI: `.github/workflows/ci.yml` — `bun install`, typecheck API, `next build`.

## Auth

- `POST /api/auth/register` — `{ email, password, displayName? }`
- `POST /api/auth/login` — `{ email, password }`
- Все `/api/conversations/*` требуют `Authorization: Bearer <token>`

## WebSocket

- `ws://localhost:3001/ws?token=JWT&conversationId=UUID`
- Событие `messages.created` — realtime обновление чата

## Что из инфраструктуры имеет смысл

| Технология | Hyphai | Зачем |
|---|---|---|
| **Redis** | ✅ | Pub/Sub для WebSocket между инстансами API |
| **Prometheus + Grafana** | ✅ | Метрики API (`/metrics`), harness eval |
| **RabbitMQ** | ❌ | Нужен для async jobs (email, LLM queue) — overkill для MVP |
| **Kafka** | ❌ | Event streaming at scale — overkill для хакатона |

## Hyphae network (ветки и share)

- **Ветка** — кнопка на сообщении создаёт новый диалог с историей до этой точки (`parent_id`).
- **Поделиться** — read-only ссылка `/share/{slug}` без авторизации.

## License

MIT

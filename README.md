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

## License

MIT

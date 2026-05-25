# Hyphai

**Universal chat as a living network** — built with Spec-Driven Development.

> Hyphae connect everything underground. AI weaves through every conversation.

## Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 16, React, TypeScript, Tailwind |
| Backend | Hono on Bun |
| Database | PostgreSQL + Kysely |
| Harness | OpenSpec (Spec-Driven Development) |

## Quick start

```bash
# 1. Postgres
docker compose up -d

# 2. Install & migrate
bun install
bun run db:migrate

# 3. Dev (api :3001 + web :3000)
bun run dev
```

Copy `.env.example` to `.env` before starting.

## OpenSpec workflow

```bash
# In Cursor chat:
/opsx-propose <idea>
/opsx-apply
/opsx-archive
```

Specs live in `openspec/changes/` — the source of truth before code.

## License

MIT

# Hyphai

**Universal chat as a living network** — built with Spec-Driven Development.

> Hyphae connect everything underground. AI weaves through every conversation.

## Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 16, React, TypeScript, Tailwind |
| Backend | Hono on Bun |
| Database | PostgreSQL + Kysely |
| Harness | OpenSpec |

## Quick start

```bash
cp .env.example .env
echo 'NEXT_PUBLIC_API_URL=http://localhost:3001' > apps/web/.env.local

docker compose up -d
bun install
bun run db:migrate
bun run dev:api   # terminal 1 → :3001
bun run dev:web   # terminal 2 → :3000
```

Postgres runs on **port 5433** (avoids conflict with local Postgres on 5432).

## What is harness engineering?

Simple analogy:

| Part | In a car | In AI development |
|---|---|---|
| Engine | Motor | LLM (Claude, GPT…) |
| Harness | Steering, brakes, dashboard, rules | Specs, skills, tools, checks |
| Driver | You | Harness engineer (you) |

The model alone is powerful but unpredictable. The **harness** is everything around it that makes work reliable: instructions, memory, verification, rollback.

**OpenSpec** is one harness layer: before code is written, specs define WHAT to build. The AI reads specs and implements against them — not against chat history that gets lost.

### This project's harness layers

```
openspec/changes/add-universal-chat/
├── proposal.md   ← WHY we build this
├── design.md     ← HOW (architecture decisions)
├── specs/        ← WHAT (testable requirements)
└── tasks.md      ← checklist for implementation
```

Cursor skills in `.cursor/skills/` guide the AI through `/opsx-propose` and `/opsx-apply`.

## OpenSpec workflow

```bash
# In Cursor chat:
/opsx-propose add dark mode
/opsx-apply
/opsx-archive
```

## API

| Method | Path | Description |
|---|---|---|
| GET | `/api/conversations` | List chats |
| POST | `/api/conversations` | Create chat |
| DELETE | `/api/conversations/:id` | Delete chat |
| GET | `/api/conversations/:id/messages` | Message history |
| POST | `/api/conversations/:id/messages` | Send message (+ echo reply) |

## License

MIT

## Context

Greenfield monorepo. OpenSpec change `add-universal-chat`. Target stack matches BOS.PRO surface: TypeScript, React, Postgres — with Hono + Bun for API and Next.js 16 for UI.

## Goals / Non-Goals

**Goals:**
- Working universal chat demo with persistent Postgres storage
- Clean separation: `apps/web` (UI) + `apps/api` (Hono)
- Type-safe DB access via Kysely
- Runnable via `docker compose up` + `bun run dev`

**Non-Goals:**
- Auth, WebSocket, real AI models, multi-tenant

## Decisions

### Monorepo with Bun workspaces
**Why:** Single repo, shared scripts, Bun runs both Hono and Next.js dev servers.
**Alternative:** Separate repos — rejected for hackathon simplicity.

### Hono on Bun (separate API) vs Next.js Route Handlers
**Why:** Explicit API layer demonstrates fullstack architecture; Hono is lightweight and TypeScript-native.
**Alternative:** Next.js API routes — simpler but less aligned with user's Consentry/Hono preference.

### Kysely over Drizzle
**Why:** Type-safe SQL without ORM magic; matches Consentry patterns; explicit queries for demo/debug.
**Alternative:** Drizzle — better for relation-heavy schemas, overkill here.

### Echo assistant replies
**Why:** Universal chat MVP without external AI API keys. Proves message flow end-to-end.
**Alternative:** OpenAI integration — out of scope for hackathon entry task.

### UUID primary keys
**Why:** Safe for distributed/API exposure; standard for chat apps.

## Risks / Trade-offs

- [CORS between web:3000 and api:3001] → Enable Hono CORS middleware for localhost
- [No Bun on all machines] → Document Node fallback in README
- [No realtime] → UI refetches after send; acceptable for MVP

## Migration Plan

1. `docker compose up -d` — start Postgres
2. Run SQL migrations via api script
3. `bun run dev` — start api + web concurrently

## Open Questions

(none — ready to implement)

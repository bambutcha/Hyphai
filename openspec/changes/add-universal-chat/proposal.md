## Why

Hyphai needs a universal chat — a general-purpose messaging interface where users manage multiple conversations with persistent history. This is the hackathon deliverable demonstrating Spec-Driven Development with OpenSpec: specs first, then code.

## What Changes

- Add conversation management (create, list, select, delete)
- Add message exchange (send user messages, store in Postgres, display history)
- Add chat UI (sidebar + message pane, responsive, dark theme)
- Add Hono API on Bun with Kysely + PostgreSQL
- Add Next.js 16 frontend consuming the API
- Add Docker Compose for local Postgres

## Capabilities

### New Capabilities

- `conversations`: CRUD for chat threads stored in PostgreSQL
- `messages`: Send and retrieve messages within a conversation
- `chat-ui`: Frontend interface for browsing and chatting

### Modified Capabilities

(none — greenfield project)

## Impact

- New monorepo structure: `apps/web`, `apps/api`
- New PostgreSQL schema: `conversations`, `messages`
- New REST API on port 3001, web on port 3000
- Docker required for Postgres

## Non-goals

- Real LLM / AI integration (placeholder echo replies only)
- User authentication
- WebSocket / realtime (polling or refresh on action is enough for MVP)
- Production deployment

## 1. Infrastructure

- [x] 1.1 Set up Bun monorepo with workspaces (apps/web, apps/api)
- [x] 1.2 Add docker-compose.yml for PostgreSQL
- [x] 1.3 Add root dev scripts and .env.example

## 2. API (Hono + Kysely)

- [x] 2.1 Scaffold apps/api with Hono on Bun
- [x] 2.2 Define Kysely schema and migration SQL
- [x] 2.3 Implement conversations routes (GET, POST, GET/:id, DELETE)
- [x] 2.4 Implement messages routes (GET, POST with echo reply)
- [x] 2.5 Add CORS and error handling

## 3. Web (Next.js 16)

- [x] 3.1 Scaffold apps/web with Next.js 16, Tailwind, TypeScript
- [x] 3.2 Create API client module
- [x] 3.3 Build ConversationSidebar component
- [x] 3.4 Build MessagePane and MessageInput components
- [x] 3.5 Apply Hyphai dark theme styling

## 4. Integration & Docs

- [x] 4.1 Wire web to api, verify full flow locally
- [x] 4.2 Write README with setup and harness/OpenSpec explanation

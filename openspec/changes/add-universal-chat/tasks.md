## 1. Infrastructure

- [ ] 1.1 Set up Bun monorepo with workspaces (apps/web, apps/api)
- [ ] 1.2 Add docker-compose.yml for PostgreSQL
- [ ] 1.3 Add root dev scripts and .env.example

## 2. API (Hono + Kysely)

- [ ] 2.1 Scaffold apps/api with Hono on Bun
- [ ] 2.2 Define Kysely schema and migration SQL
- [ ] 2.3 Implement conversations routes (GET, POST, GET/:id, DELETE)
- [ ] 2.4 Implement messages routes (GET, POST with echo reply)
- [ ] 2.5 Add CORS and error handling

## 3. Web (Next.js 16)

- [ ] 3.1 Scaffold apps/web with Next.js 16, Tailwind, TypeScript
- [ ] 3.2 Create API client module
- [ ] 3.3 Build ConversationSidebar component
- [ ] 3.4 Build MessagePane and MessageInput components
- [ ] 3.5 Apply Hyphai dark theme styling

## 4. Integration & Docs

- [ ] 4.1 Wire web to api, verify full flow locally
- [ ] 4.2 Write README with setup and harness/OpenSpec explanation

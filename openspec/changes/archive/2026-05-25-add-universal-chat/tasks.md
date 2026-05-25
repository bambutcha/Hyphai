## 1. Инфраструктура

- [x] 1.1 Bun monorepo с workspaces (apps/web, apps/api)
- [x] 1.2 docker-compose.yml для PostgreSQL
- [x] 1.3 Корневые dev-скрипты и .env.example

## 2. API (Hono + Kysely)

- [x] 2.1 Scaffold apps/api — Hono на Bun
- [x] 2.2 Kysely schema и SQL-миграции
- [x] 2.3 Роуты conversations (GET, POST, GET/:id, DELETE)
- [x] 2.4 Роуты messages (GET, POST с echo-ответом)
- [x] 2.5 CORS и обработка ошибок

## 3. Web (Next.js 16)

- [x] 3.1 Scaffold apps/web — Next.js 16, Tailwind, TypeScript
- [x] 3.2 API-клиент
- [x] 3.3 ConversationSidebar
- [x] 3.4 MessagePane и поле ввода
- [x] 3.5 Тёмная тема Hyphai

## 4. Интеграция и доки

- [x] 4.1 Связать web с api, проверить flow локально
- [x] 4.2 README с setup и объяснением harness/OpenSpec

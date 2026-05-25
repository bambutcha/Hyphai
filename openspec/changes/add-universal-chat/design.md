## Контекст

Greenfield monorepo. OpenSpec change `add-universal-chat`. Стек как у BOS.PRO: TypeScript, React, Postgres — плюс Hono + Bun для API и Next.js 16 для UI.

## Цели / Не-цели

**Цели:**
- Рабочий демо универсального чата с Postgres
- Разделение: `apps/web` (UI) + `apps/api` (Hono)
- Type-safe доступ к БД через Kysely
- Запуск через `docker compose up` + `bun run dev`

**Не-цели:**
- Auth, WebSocket, реальные AI-модели, multi-tenant

## Решения

### Monorepo с Bun workspaces
**Почему:** один репо, общие скрипты, Bun крутит и Hono, и Next.js.
**Альтернатива:** отдельные репо — отвергнуто для простоты хакатона.

### Hono на Bun (отдельный API) vs Next.js Route Handlers
**Почему:** явный API-слой, Hono лёгкий и TypeScript-native.
**Альтернатива:** API routes в Next.js — проще, но менее явная архитектура.

### Kysely вместо Drizzle
**Почему:** type-safe SQL без магии ORM; явные запросы для дебага.
**Альтернатива:** Drizzle — избыточен для простой схемы чата.

### Echo-ответы ассистента
**Почему:** MVP без API-ключей LLM. Доказывает полный flow сообщений.
**Альтернатива:** OpenAI — вне scope задачи хакатона.

### UUID как primary keys
**Почему:** безопасно для API; стандарт для чатов.

## Риски / Компромиссы

- [CORS web:3000 ↔ api:3001] → CORS middleware в Hono для localhost
- [Не у всех есть Bun] → описать fallback в README
- [Нет realtime] → UI перезапрашивает после отправки; ок для MVP

## План запуска

1. `docker compose up -d` — Postgres
2. SQL-миграции через скрипт api
3. `bun run dev` — api + web

## Открытые вопросы

(нет — готовы к реализации)

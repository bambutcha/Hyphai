## 1. Структура и hero

- [x] 1.1 Hero: название, слоган, badges (CI, license)
- [x] 1.2 Mermaid/ascii архитектура (web → api → postgres/redis; prometheus → grafana)
- [x] 1.3 Оглавление якорей для длинных секций

## 2. Почему стек

- [x] 2.1 Frontend: Next.js 16 + React + Tailwind vs альтернативы (таблица)
- [x] 2.2 Backend: Hono + Bun vs Express/Node
- [x] 2.3 Data: PostgreSQL + Kysely vs Prisma/SQLite
- [x] 2.4 Realtime: Redis pub/sub vs sticky sessions / in-memory
- [x] 2.5 Workflow: OpenSpec vs ad-hoc specs
- [x] 2.6 LLM: OpenRouter vs self-hosted (кратко)

## 3. Observability

- [x] 3.1 Секция Prometheus: scrape, `/metrics`, PromQL пример
- [x] 3.2 Секция Grafana: datasource, Explore, localhost:3002
- [x] 3.3 Таблица «что смотреть» (requests, ws connections)

## 4. CI/CD

- [x] 4.1 Описание `.github/workflows/ci.yml` (триггеры, шаги, зачем)
- [x] 4.2 Как локально повторить: `bun run typecheck` + `bun run build`

## 5. Практика (рефакторинг существующего)

- [x] 5.1 Сжать Quick start + Deploy + LLM (убрать дубли)
- [x] 5.2 API cheatsheet + Hyphae network — оставить компактно
- [x] 5.3 Финальная вычитка: ≤250 строк, без воды

## 6. Verification

- [x] 6.1 Все ссылки и порты совпадают с `docker-compose.yml`
- [x] 6.2 Markdown рендерится корректно на GitHub

## 7. Start

- [x] 7.1 Как запустить проект

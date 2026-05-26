## Context

Monorepo Hyphai: `apps/web` (Next 16), `apps/api` (Hono + Bun), Postgres, Redis, Prometheus scrape `/metrics`, Grafana на :3002, GitHub Actions CI.

## Goals / Non-Goals

**Goals:** README читается за 10 минут; каждый технологический выбор обоснован одной таблицей или списком; observability и CI — actionable.

**Non-Goals:** Отдельный `docs/` сайт, скриншоты Grafana dashboards (можно placeholder текст).

## Decisions

### 1. Структура README (порядок секций)

1. Hero + badges (build, license)
2. Что это (2–3 предложения)
3. Архитектура (ascii или mermaid — компактно)
4. **Почему стек** (подсекции по слоям)
5. Quick start (Docker + local dev) — таблица URL
6. LLM / OpenRouter — кратко
7. **Observability** (Prometheus + Grafana)
8. **CI/CD**
9. Deploy / env
10. API cheatsheet (auth, ws) — сжато
11. Hyphae features (fork, share)
12. License

### 2. Формат сравнений

Таблица: `| Критерий | Hyphai | Альтернатива |` — максимум 4–5 строк на сравнение, без эссе.

Примеры пар:
- Next.js vs Remix/Vite SPA — SSR, ecosystem, deploy
- Hono+Bun vs Express+Node — cold start, TS-native, footprint
- Kysely vs Prisma/Drizzle — SQL control vs ORM magic
- Postgres vs SQLite — concurrency, production
- Redis pub/sub vs sticky sessions — horizontal scale WS
- OpenSpec vs «только README» — spec-driven tasks

### 3. Prometheus / Grafana

Факты из кода:
- `GET /metrics` — `hyphai_http_requests_total`, `hyphai_ws_connections`
- Prometheus scrape `api:3001` каждые 15s
- Grafana → datasource Prometheus `http://prometheus:9090`

Инструкция: поднять compose → открыть :9090 (PromQL `hyphai_http_requests_total`) → :3002 Explore → datasource Prometheus.

### 4. CI/CD

Workflow `CI`: on push/PR to main → `bun install` → api typecheck → web build. Цель: сломать типы/сборку до merge.

### 5. Язык

README на **русском** (как UI); технические термины на английском (Prometheus, CI).

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| README раздуется | лимит ~200–250 строк |
| Устаревание при смене стека | OpenSpec change при major upgrades |

## Open Questions

- Добавить mermaid diagram — да, один блок «Architecture».

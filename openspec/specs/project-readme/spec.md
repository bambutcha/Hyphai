# project-readme Specification

## Purpose
TBD - created by archiving change premium-readme. Update Purpose after archive.
## Requirements
### Requirement: Hero и позиционирование
Корневой `README.md` SHALL начинаться с названия проекта, однострочного слогана и краткого описания (≤4 предложения) без маркетинговой «воды».

#### Scenario: Первый экран
- **WHEN** читатель открывает README
- **THEN** за 5 секунд понимает: universal chat, monorepo, Docker-ready

### Requirement: Обоснование стека
README SHALL содержать раздел с обоснованием выбора технологий по слоям (frontend, backend/runtime, DB, cache/realtime, observability, workflow) с явным сравнением хотя бы с одной альтернативой на слой.

#### Scenario: Frontend
- **WHEN** читатель ищет почему Next.js
- **THEN** видит сравнение с альтернативой (напр. Remix, Vite SPA) по критериям: SSR/SEO, DX, deploy

#### Scenario: Backend
- **WHEN** читатель ищет почему Hono + Bun
- **THEN** видит сравнение с Express/Fastify + Node по latency, TS, размеру образа

### Requirement: Observability
README SHALL описать роль Prometheus и Grafana, какие метрики экспортирует API, URL сервисов в compose и минимальные шаги проверки (PromQL + Grafana Explore).

#### Scenario: Метрики API
- **WHEN** разработчик открывает `/metrics`
- **THEN** README перечисляет доступные метрики (`hyphai_http_requests_total`, `hyphai_ws_connections`)

#### Scenario: Локальный стек
- **WHEN** поднят `docker compose`
- **THEN** README указывает Prometheus :9090 и Grafana :3002 с дефолтными credentials

### Requirement: CI/CD
README SHALL объяснять GitHub Actions workflow: триггеры (push/PR), шаги (install, typecheck, build) и зачем это нужно (раннее обнаружение поломок).

#### Scenario: PR check
- **WHEN** открыт PR в main
- **THEN** README описывает, что CI должен пройти до merge

### Requirement: Практические секции
README SHALL сохранять Quick start, env/deploy, LLM и краткий API reference без дублирования одних и тех же команд в нескольких местах.

#### Scenario: Быстрый старт
- **WHEN** новый разработчик клонирует репо
- **THEN** находит одну primary-команду `docker compose up` и таблицу URL

### Requirement: Лаконичность
README SHALL избегать длинных абзацев (>10 строк подряд) и повторов; сравнения — таблицы или bullet lists.

#### Scenario: Плотность текста
- **WHEN** README прочитан целиком


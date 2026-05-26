## Why

Текущий README — справочник команд, но не объясняет **почему** выбран стек, чем он лучше альтернатив, и как пользоваться observability/CI. Для open-source и онбординга нужен один плотный, визуально сильный документ без «воды».

## What Changes

- Полная переработка `README.md`: структура, типографика (таблицы, блоки, якоря), краткий hero.
- Раздел **«Почему этот стек»** — по слоям с сравнением (Next vs Remix, Hono/Bun vs Express/Node, Postgres vs SQLite, Redis vs in-memory WS, Bun vs npm, OpenSpec vs ad-hoc docs).
- Раздел **Prometheus + Grafana** — что собирается (`/metrics`), как открыть, типовой flow (scrape → query → dashboard).
- Раздел **CI/CD** — что делает `.github/workflows/ci.yml`, когда запускается, что блокирует merge.
- Сохранить практические блоки: Quick start, LLM, Deploy, API — сжато, без дублирования.

## Capabilities

### New Capabilities

- `project-readme`: требования к содержанию и структуре корневого README.

### Modified Capabilities

_(нет — поведение приложения не меняется)_

## Impact

- `README.md` (основной deliverable)
- Опционально: badge CI в README (ссылка на workflow)

## Non-goals

- Документация API (OpenAPI/Swagger)
- Wiki / docs site (Docusaurus)
- Перевод README на английский
- Marketing landing copy

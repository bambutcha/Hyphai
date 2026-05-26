# deploy-ci Specification

## Purpose
TBD - created by archiving change world-ready-product. Update Purpose after archive.
## Requirements
### Requirement: CI pipeline
Репозиторий SHALL содержать GitHub Actions workflow, запускающий сборку web и проверку типов api на push/PR.

#### Scenario: Успешный PR
- **WHEN** открыт PR в main
- **THEN** workflow выполняет `bun install`, `bun run build` (web), typecheck api без ошибок

### Requirement: Deploy guide
README SHALL содержать пошаговый раздел «Deploy in 5 min» с переменными окружения и ссылками на web + api.

#### Scenario: Новый деплойщик
- **WHEN** разработчик следует README
- **THEN** может поднять публичный инстанс с Postgres, Redis, OPENROUTER_API_KEY

### Requirement: Stable LLM для production
Документация SHALL рекомендовать стабильную (не только free router) модель для публичного инстанса и описывать лимиты free tier.

#### Scenario: Production env
- **WHEN** задан `OPENROUTER_MODEL` paid или стабильная free с credits
- **THEN** публичный инстанс не зависит только от `openrouter/free`


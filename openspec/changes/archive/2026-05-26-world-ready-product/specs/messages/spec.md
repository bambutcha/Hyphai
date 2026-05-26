## ADDED Requirements

### Requirement: Stream endpoint отправки
Система SHALL поддерживать `POST /conversations/:id/messages/stream` с SSE в дополнение к синхронному POST.

#### Scenario: Совместимость истории
- **WHEN** stream завершён событием `done`
- **THEN** assistant message идентичен по формату синхронному POST и появляется в `GET /messages`

## ADDED Requirements

### Requirement: OpenRouter streaming
Система SHALL вызывать OpenRouter chat completions с `stream: true` и проксировать chunks в SSE.

#### Scenario: Stream chunks
- **WHEN** включён stream mode
- **THEN** API читает SSE/NDJSON от OpenRouter и эмитит `chunk` клиенту

#### Scenario: Сохранение после stream
- **WHEN** stream OpenRouter завершён
- **THEN** полный текст сохраняется как assistant message

### Requirement: Метаданные модели
Система SHALL возвращать `modelUsed`, `requestedModel`, `usedFallback` при завершении генерации (см. `llm-transparency`).

#### Scenario: Fallback chain
- **WHEN** сработал fallback при stream или sync
- **THEN** `usedFallback` = true в финальном payload

# streaming-chat Specification

## Purpose
TBD - created by archiving change world-ready-product. Update Purpose after archive.
## Requirements
### Requirement: SSE-стриминг ответа LLM
API SHALL предоставлять endpoint отправки сообщения со стримингом (`text/event-stream`), отдающий чанки текста assistant до завершения генерации.

#### Scenario: Чанки во время генерации
- **WHEN** клиент вызывает stream endpoint после отправки user message
- **THEN** клиент получает SSE-события `chunk` с фрагментами текста до события `done`

#### Scenario: Завершение стрима
- **WHEN** LLM завершил генерацию
- **THEN** SSE-событие `done` содержит сохранённое assistant message; сообщение доступно в истории и через WebSocket `messages.created`

#### Scenario: Ошибка стрима
- **WHEN** LLM падает mid-stream
- **THEN** SSE-событие `error` с полем `error`; user message сохранён

### Requirement: UI streaming consumption
UI SHALL отображать частичный ответ assistant во время стрима и финализировать bubble при `done`.

#### Scenario: Печать ответа
- **WHEN** приходят SSE `chunk`
- **THEN** в ленте виден растущий текст assistant (typing effect)

#### Scenario: Отмена sending state
- **WHEN** приходит `done` или `error`
- **THEN** состояние sending снимается; composer снова активен


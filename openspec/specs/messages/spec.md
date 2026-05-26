# messages Specification

## Purpose
TBD - created by archiving change add-universal-chat. Update Purpose after archive.
## Requirements
### Requirement: Список сообщений в диалоге
Система SHALL возвращать все сообщения диалога, отсортированные по created_at по возрастанию.

#### Scenario: Пустой диалог
- **WHEN** в диалоге нет сообщений
- **THEN** API возвращает пустой массив

#### Scenario: Упорядоченная история
- **WHEN** в диалоге три сообщения в разное время
- **THEN** сообщения возвращаются от старых к новым

### Requirement: Отправка сообщения пользователя
Система SHALL принимать сообщение пользователя и сохранять в PostgreSQL.

#### Scenario: Валидное сообщение
- **WHEN** клиент шлёт `{ "content": "Привет" }` в существующий диалог
- **THEN** сохраняется сообщение с role `user`, возвращаются id и timestamp

#### Scenario: Пустой текст отклоняется
- **WHEN** клиент шлёт `{ "content": "" }` или только пробелы
- **THEN** API возвращает HTTP 400

### Requirement: Обновление updated_at диалога
Система SHALL обновлять updated_at диалога при новом сообщении.

#### Scenario: Обновление времени
- **WHEN** отправлено новое сообщение
- **THEN** updated_at диалога = время последнего сообщения

### Requirement: Ответ ассистента через LLM
Система SHALL после сохранения сообщения пользователя вызывать LLM (OpenRouter) и сохранять ответ с role `assistant` на основе сгенерированного текста, а не echo-заглушки.

#### Scenario: Успешная генерация
- **WHEN** пользователь отправляет сообщение в диалог и LLM доступен
- **THEN** сохраняется user message, затем assistant message с текстом от LLM; API возвращает оба; WebSocket рассылает `messages.created`

#### Scenario: Сбой LLM
- **WHEN** вызов LLM завершается ошибкой
- **THEN** user message остаётся сохранённым; assistant не создаётся; API возвращает HTTP 502/503/504 с полем `error`

#### Scenario: Ответ на русском
- **WHEN** пользователь пишет на русском
- **THEN** assistant отвечает на русском (через system prompt; качество зависит от модели)

### Requirement: Stream endpoint отправки
Система SHALL поддерживать `POST /conversations/:id/messages/stream` с SSE в дополнение к синхронному POST.

#### Scenario: Совместимость истории
- **WHEN** stream завершён событием `done`
- **THEN** assistant message идентичен по формату синхронному POST и появляется в `GET /messages`


## ADDED Requirements

### Requirement: Конфигурация OpenRouter
Система SHALL читать `OPENROUTER_API_KEY` и `OPENROUTER_MODEL` из окружения API. Модель по умолчанию SHALL быть `openrouter/free` (бесплатный router OpenRouter).

#### Scenario: Модель по умолчанию
- **WHEN** `OPENROUTER_MODEL` не задан
- **THEN** API использует `openrouter/free` для chat completions

#### Scenario: Ключ не задан
- **WHEN** `OPENROUTER_API_KEY` пуст или отсутствует
- **THEN** отправка сообщения с генерацией ответа возвращает HTTP 503 с полем `error`, указывающим что LLM не настроен

### Requirement: Вызов chat completions
Система SHALL вызывать `POST https://openrouter.ai/api/v1/chat/completions` с телом OpenAI-формата (`model`, `messages`) и заголовком `Authorization: Bearer <key>`.

#### Scenario: Успешный ответ
- **WHEN** OpenRouter возвращает 200 с `choices[0].message.content`
- **THEN** API использует этот текст как content сообщения assistant

#### Scenario: Таймаут
- **WHEN** ответ OpenRouter не получен в пределах настроенного таймаута
- **THEN** API возвращает HTTP 504 с полем `error` о таймауте LLM

#### Scenario: Rate limit
- **WHEN** OpenRouter возвращает HTTP 429
- **THEN** API возвращает HTTP 502 с полем `error` о превышении лимита LLM

### Requirement: System prompt Hyphai
Система SHALL добавлять system-сообщение с инструкцией отвечать на русском как ассистент Hyphai (универсальный чат, метафора грибницы).

#### Scenario: Первое сообщение в диалоге
- **WHEN** пользователь отправляет первое сообщение в пустом диалоге
- **THEN** запрос к OpenRouter включает system prompt и сообщение user

### Requirement: Контекст истории
Система SHALL передавать в OpenRouter последние сообщения диалога (roles `user` и `assistant`) в хронологическом порядке, с ограничением глубины истории (не более 20 сообщений).

#### Scenario: Длинный диалог
- **WHEN** в диалоге более 20 сообщений
- **THEN** в запрос попадают только последние 20 (включая новое user), старые обрезаются

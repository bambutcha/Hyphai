## REMOVED Requirements

### Requirement: Echo-ответ ассистента
**Reason**: Заменён реальной генерацией через OpenRouter LLM.
**Migration**: Ответ assistant создаётся только после успешного вызова LLM; см. ADDED «Ответ ассистента через LLM».

## ADDED Requirements

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

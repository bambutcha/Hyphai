## ADDED Requirements

### Requirement: Метаданные модели в ответе API
API SHALL возвращать в завершении генерации (stream `done` или JSON POST) поля `modelUsed`, `requestedModel`, `usedFallback` (boolean).

#### Scenario: Прямой ответ
- **WHEN** запрошенная модель ответила без fallback
- **THEN** `modelUsed` равен `requestedModel`, `usedFallback` = false

#### Scenario: Fallback
- **WHEN** запрошенная модель дала 429 и сработала цепочка fallback
- **THEN** `modelUsed` — фактическая модель; `requestedModel` — выбор пользователя; `usedFallback` = true

### Requirement: Бейдж модели в UI
UI SHALL показывать дискретный индикатор модели под последним assistant message или в header чата.

#### Scenario: Fallback виден пользователю
- **WHEN** `usedFallback` = true
- **THEN** UI показывает, что ответил другой моделью (человекочитаемые label из списка моделей)

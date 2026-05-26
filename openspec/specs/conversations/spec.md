# conversations Specification

## Purpose
TBD - created by archiving change add-universal-chat. Update Purpose after archive.
## Requirements
### Requirement: Список диалогов
Система SHALL возвращать все диалоги, отсортированные по updated_at — сначала недавние.

#### Scenario: Пустой список
- **WHEN** диалогов нет
- **THEN** API возвращает пустой массив

#### Scenario: Несколько диалогов
- **WHEN** есть три диалога с разным updated_at
- **THEN** API возвращает все три, сортировка по updated_at по убыванию

### Requirement: Создание диалога
Система SHALL создавать новый диалог с опциональным заголовком.

#### Scenario: С заголовком
- **WHEN** клиент шлёт `{ "title": "Чат про проект" }`
- **THEN** создаётся диалог с UUID и указанным title

#### Scenario: Без заголовка
- **WHEN** клиент шлёт `{}` или `{ "title": null }`
- **THEN** создаётся диалог с title «Новый диалог»

### Requirement: Получение диалога по id
Система SHALL возвращать один диалог по валидному UUID.

#### Scenario: Найден
- **WHEN** запрос с существующим id
- **THEN** возвращается объект диалога

#### Scenario: Не найден
- **WHEN** запрос с несуществующим id
- **THEN** API возвращает HTTP 404

### Requirement: Удаление диалога
Система SHALL удалять диалог и все его сообщения.

#### Scenario: Успешное удаление
- **WHEN** клиент удаляет существующий диалог
- **THEN** диалог и сообщения удалены, API возвращает HTTP 204

### Requirement: Переименование диалога
Система SHALL позволять обновить заголовок существующего диалога владельца.

#### Scenario: Успешное переименование
- **WHEN** клиент шлёт `PATCH /api/conversations/:id` с `{ "title": "Новое имя" }`
- **THEN** title обновляется, возвращается объект диалога с новым title

#### Scenario: Пустой заголовок
- **WHEN** title пустой или только пробелы
- **THEN** API возвращает HTTP 400

#### Scenario: Чужой диалог
- **WHEN** id существует, но принадлежит другому пользователю
- **THEN** API возвращает HTTP 404

### Requirement: Parent conversation (волна C)
Таблица conversations SHALL иметь nullable `parent_id` для ветвления.

#### Scenario: Fork metadata
- **WHEN** создана ветка от диалога A
- **THEN** новый диалог имеет `parent_id = A.id`

### Requirement: Share slug (волна C)
Таблица conversations SHALL иметь nullable `share_slug` unique для публичного read-only доступа.

#### Scenario: Enable share
- **WHEN** владелец включает share
- **THEN** генерируется уникальный slug


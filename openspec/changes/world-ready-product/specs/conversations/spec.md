## ADDED Requirements

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

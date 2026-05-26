## ADDED Requirements

### Requirement: Toast-уведомления
UI SHALL показывать краткие toast для success/error операций (создание чата, отправка, rename, delete) в дополнение к ErrorBanner для критичных ошибок чата.

#### Scenario: Успешное действие
- **WHEN** операция завершилась успешно (например rename)
- **THEN** появляется toast success, исчезает автоматически

#### Scenario: Некритичная ошибка
- **WHEN** операция в сайдбаре завершилась ошибкой
- **THEN** toast error с локализованным текстом

### Requirement: Skeleton loading
UI SHALL показывать skeleton shimmer при загрузке списка диалогов и истории сообщений вместо только текстовой метки.

#### Scenario: Загрузка диалогов
- **WHEN** `loadingConversations`
- **THEN** в сайдбаре 3–5 skeleton-строк

#### Scenario: Загрузка сообщений
- **WHEN** `loadingMessages`
- **THEN** в ленте 2–4 skeleton-bubble

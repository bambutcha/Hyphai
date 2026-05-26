## MODIFIED Requirements

### Requirement: Адаптивность
UI SHALL работать на desktop и mobile с off-canvas drawer для сайдбара на узких экранах.

#### Scenario: Мобильный drawer
- **WHEN** ширина экрана < 768px
- **THEN** сайдбар в drawer; чат на полную ширину; поле ввода не ломается

#### Scenario: Desktop
- **WHEN** ширина экрана >= 768px
- **THEN** сайдбар закреплён слева

## ADDED Requirements

### Requirement: Маршрутизация landing vs app
UI SHALL показывать landing для гостей и ChatApp для авторизованных на `/`.

#### Scenario: Гость
- **WHEN** нет JWT
- **THEN** landing page (см. `landing-page`)

#### Scenario: Авторизован
- **WHEN** есть JWT
- **THEN** ChatApp

### Requirement: Streaming UI
UI SHALL использовать stream endpoint по умолчанию для отправки сообщений (см. `streaming-chat`).

#### Scenario: Отправка
- **WHEN** пользователь отправляет сообщение
- **THEN** UI подключается к SSE и обновляет ленту по чанкам

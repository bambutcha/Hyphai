## ADDED Requirements

### Requirement: Ветка диалога (fork)
Система SHALL позволять создать новый диалог как ветку от существующего сообщения с сохранением `parent_id` / ссылки на источник.

#### Scenario: Fork с сообщения
- **WHEN** пользователь выбирает «Продолжить в ветке» на assistant/user message
- **THEN** создаётся новый диалог с историей до этой точки (или пустой с контекстом в system) и `parent_id` указывает на исходный диалог

### Requirement: Публичный share диалога
Система SHALL позволять владельцу диалога сгенерировать read-only share link.

#### Scenario: Создание share
- **WHEN** пользователь включает «Поделиться» для диалога
- **THEN** генерируется slug/token; только сообщения этого диалога доступны без auth

#### Scenario: Просмотр share
- **WHEN** гость открывает share URL
- **THEN** видит read-only ленту сообщений без composer

### Requirement: Graph empty state
UI SHALL на welcome empty state показывать интерактивный или анимированный hyphae-граф (узлы/связи), отражающий метафору «живой сети».

#### Scenario: Welcome graph
- **WHEN** у пользователя нет диалогов
- **THEN** помимо CTA виден graph-визуал hyphae; клик по узлу MAY создавать чат (опционально)

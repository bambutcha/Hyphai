## ADDED Requirements

### Requirement: Mobile drawer для сайдбара
UI SHALL на viewport `<768px` скрывать постоянный сайдбар и показывать его в off-canvas drawer по кнопке меню.

#### Scenario: Открытие drawer
- **WHEN** пользователь на mobile жмёт кнопку меню
- **THEN** сайдбар выезжает поверх контента с backdrop

#### Scenario: Закрытие
- **WHEN** пользователь выбирает диалог или жмёт backdrop
- **THEN** drawer закрывается; активный чат виден на весь экран

#### Scenario: Desktop без регрессии
- **WHEN** viewport `>=768px`
- **THEN** сайдбар остаётся закреплённым слева как сейчас

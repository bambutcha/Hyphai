## MODIFIED Requirements

### Requirement: Mobile drawer для сайдбара
UI SHALL на viewport `<768px` скрывать постоянный сайдбар и показывать его в off-canvas drawer по кнопке меню. Fixed-элементы (кнопка меню, composer, toasts) SHALL учитывать `safe-area-inset` через design tokens проекта.

#### Scenario: Открытие drawer
- **WHEN** пользователь на mobile жмёт кнопку меню
- **THEN** сайдбар выезжает поверх контента с backdrop

#### Scenario: Закрытие
- **WHEN** пользователь выбирает диалог или жмёт backdrop
- **THEN** drawer закрывается; активный чат виден на весь экран

#### Scenario: Desktop без регрессии
- **WHEN** viewport `>=768px`
- **THEN** сайдбар остаётся закреплённым слева как сейчас

#### Scenario: Safe area iOS
- **WHEN** приложение открыто на устройстве с вырезом/notch
- **THEN** composer и нижние toasts не перекрываются home indicator; верхние fixed-кнопки не под notch

## ADDED Requirements

### Requirement: Viewport и отсутствие горизонтального скролла
Приложение SHALL использовать `viewport-fit=cover` и не допускать горизонтального скролла основного контента на ширине 320px–428px.

#### Scenario: Узкий iPhone
- **WHEN** ширина viewport 320px
- **THEN** нет горизонтальной полосы прокрутки на `/`, auth, chat, share

#### Scenario: Корневой layout
- **WHEN** пользователь в ChatApp
- **THEN** корневой контейнер использует `100dvh`/`min-h-dvh` и `overflow-x: hidden` на уровне shell

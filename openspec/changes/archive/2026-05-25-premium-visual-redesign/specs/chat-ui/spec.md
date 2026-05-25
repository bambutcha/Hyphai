## MODIFIED Requirements

### Requirement: Визуальный стиль
UI SHALL представлять premium dark SaaS интерфейс: glass surfaces, luminous borders, глубина, grain overlay и выразительная типографика — **без** типичного AI-slop (emoji-hero, purple gradients, generic cards).

#### Scenario: Glass sidebar
- **WHEN** пользователь видит сайдбар
- **THEN** панель полупрозрачная с blur, тонкая светящаяся граница, чёткая иерархия

#### Scenario: Composer dock
- **WHEN** пользователь в активном чате
- **THEN** поле ввода — floating dock с glow при фокусе, отделён от ленты сообщений

#### Scenario: Grain и глубина
- **WHEN** загружено приложение
- **THEN** лёгкий noise/grain overlay добавляет тактильность фону

## MODIFIED Requirements

### Requirement: Анимации интерфейса
UI SHALL использовать мощные, но сдержанные анимации на базе `motion`: layout transitions, spring, stagger, AnimatePresence — для сообщений, переключения чатов и empty states.

#### Scenario: Переход empty → chat
- **WHEN** пользователь выбирает или создаёт диалог
- **THEN** empty state плавно сменяется панелью чата (cross-fade + slide)

#### Scenario: Active chat indicator
- **WHEN** пользователь выбирает другой диалог
- **THEN** индикатор активного элемента плавно перемещается (`layoutId`)

#### Scenario: Появление сообщения
- **WHEN** новое сообщение добавляется в ленту
- **THEN** bubble появляется со spring-анимацией

#### Scenario: Stagger диалогов
- **WHEN** список диалогов загружается
- **THEN** элементы появляются каскадом (stagger)

#### Scenario: Отправка сообщения
- **WHEN** пользователь нажимает «Отправить»
- **THEN** кнопка даёт tactile feedback (scale/spring), опционально краткий glow-pulse

#### Scenario: Reduced motion
- **WHEN** `prefers-reduced-motion: reduce`
- **THEN** анимации отключены или сведены к opacity-only без движения

# ui-interaction Specification

## Purpose
TBD - created by archiving change saas-interaction-polish. Update Purpose after archive.
## Requirements
### Requirement: Курсор на интерактивных элементах
UI SHALL показывать `cursor: pointer` при наведении на все кликабельные элементы (кнопки, строки диалогов, ссылки, переключатель режима auth).

#### Scenario: Кнопка действия
- **WHEN** пользователь наводит курсор на enabled кнопку (GlowButton, «Новый чат», «Отправить», retry)
- **THEN** курсор меняется на pointer

#### Scenario: Строка диалога
- **WHEN** пользователь наводит курсор на кликабельную строку в сайдбаре
- **THEN** курсор pointer, визуально усилен hover (фон/контраст)

#### Scenario: Disabled control
- **WHEN** элемент disabled (отправка, пустой draft)
- **THEN** курсор `not-allowed` или default с пониженной opacity, pointer не показывается

### Requirement: Keyboard focus visible
UI SHALL отображать видимое `focus-visible` кольцо на интерактивах при навигации с клавиатуры.

#### Scenario: Tab по сайдбару
- **WHEN** пользователь фокусирует кнопку диалога через Tab
- **THEN** видно focus ring в стиле emerald, не срезанное overflow

#### Scenario: Composer input
- **WHEN** поле ввода сообщения в фокусе с клавиатуры
- **THEN** видна граница/ring согласованная с design tokens

### Requirement: Минимальная зона нажатия
UI SHALL обеспечивать достаточный hit-area для основных CTA на touch-устройствах (не менее ~44px по меньшей стороне padding/height).

#### Scenario: Mobile CTA
- **WHEN** viewport < 768px
- **THEN** кнопки «Новый чат», «Отправить», primary empty state CTA имеют padding/height ≥ 44px

### Requirement: Производительный parallax фона
Декоративное свечение, следующее за курсором, SHALL обновляться без заметного отставания (>100ms визуального lag) и без re-render всего дерева на каждый `mousemove`.

#### Scenario: Движение мыши
- **WHEN** пользователь быстро двигает курсор по области чата
- **THEN** glow следует плавно, без «догоняния» с задержкой 700ms

#### Scenario: Reduced motion parallax
- **WHEN** `prefers-reduced-motion: reduce`
- **THEN** glow не анимируется за курсором; позиция статична

### Requirement: Icon-only affordances
UI SHALL давать текстовую подсказку (`title` или aria-label) для кнопок без видимого текста (rename, delete, dismiss banner).

#### Scenario: Rename icon
- **WHEN** пользователь наводит на ✎ в сайдбаре
- **THEN** отображается подсказка с действием (существующий aria-label достаточен)


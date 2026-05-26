## MODIFIED Requirements

### Requirement: Минимальная зона нажатия
UI SHALL обеспечивать достаточный hit-area для основных CTA и **действий в ленте сообщений** на touch-устройствах (не менее ~44px по меньшей стороне padding/height).

#### Scenario: Mobile CTA
- **WHEN** viewport < 768px
- **THEN** кнопки «Новый чат», «Отправить», primary empty state CTA имеют padding/height ≥ 44px

#### Scenario: Действия на пузыре
- **WHEN** viewport < 768px
- **THEN** «Копировать» и «Ветка» на сообщении имеют touch target ≥ 44px или всегда видимы с достаточным padding

#### Scenario: Share и menu
- **WHEN** viewport < 768px
- **THEN** кнопка меню (hamburger) и «Включить ссылку» в шапке имеют min 44×44px touch area

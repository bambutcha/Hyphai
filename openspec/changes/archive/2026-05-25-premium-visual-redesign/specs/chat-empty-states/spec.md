## MODIFIED Requirements

### Requirement: Welcome при отсутствии диалогов
UI SHALL показывать premium welcome-экран с **custom SVG-иллюстрацией** hyphae (не emoji) и motion-анимацией появления.

#### Scenario: Первый визит
- **WHEN** список диалогов пуст
- **THEN** welcome с иллюстрацией, display-заголовком и CTA с glow-эффектом

### Requirement: Выбор диалога
UI SHALL показывать pick-экран с той же визуальной системой и плавным motion.

#### Scenario: Диалоги есть, выбор не сделан
- **WHEN** есть диалоги, `activeId` не задан
- **THEN** pick-экран с иллюстрацией и подсказкой, без disabled composer

### Requirement: Анимация empty states
UI SHALL анимировать empty states через `motion` (fade + scale spring), не только CSS keyframes.

#### Scenario: Появление welcome
- **WHEN** отображается welcome
- **THEN** контент и иллюстрация появляются с spring/stagger

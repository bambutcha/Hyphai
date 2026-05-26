# chat-empty-states Specification

## Purpose
TBD - created by archiving change polish-chat-ui. Update Purpose after archive.
## Requirements
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

### Requirement: Graph welcome (волна C)
UI SHALL на variant `welcome` поддерживать опциональный hyphae-graph визуал (см. `hyphae-network`).

#### Scenario: Welcome с графом
- **WHEN** включена feature graph empty state
- **THEN** welcome показывает сеть узлов вместо только статичной иллюстрации


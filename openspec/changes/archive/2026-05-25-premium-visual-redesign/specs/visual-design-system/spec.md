## ADDED Requirements

### Requirement: Design tokens
UI SHALL использовать единую систему CSS-переменных для цветов, поверхностей, свечения и радиусов.

#### Scenario: Токены доступны глобально
- **WHEN** любой компонент рендерится в приложении
- **THEN** он может использовать переменные `--hyphai-*` для согласованного вида

### Requirement: Типографика с характером
UI SHALL использовать accent-шрифт для заголовков (Syne) и readable body-шрифт (Geist Sans).

#### Scenario: Заголовки Hyphai
- **WHEN** отображается логотип или крупный заголовок empty state
- **THEN** применяется display-шрифт, отличный от стандартного Inter-only шаблона

### Requirement: Фоновая атмосфера hyphae
UI SHALL отображать анимированный декоративный фон (сеть/нити грибницы) на основных экранах без перегрузки контента.

#### Scenario: Ambient background
- **WHEN** пользователь в основном интерфейсе чата
- **THEN** виден тонкий анимированный hyphae-фон под glass-поверхностями

#### Scenario: Reduced motion
- **WHEN** `prefers-reduced-motion: reduce`
- **THEN** фон статичен или минимален

### Requirement: Motion primitives
UI SHALL использовать библиотеку `motion` с общими variants (spring, stagger, fade) из `lib/motion.ts`.

#### Scenario: Shared variants
- **WHEN** компонент анимирует появление
- **THEN** используются согласованные timing/spring из общего модуля

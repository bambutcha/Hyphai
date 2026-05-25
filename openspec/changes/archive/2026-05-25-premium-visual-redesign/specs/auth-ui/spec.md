## MODIFIED Requirements

### Requirement: Стиль полей с ошибкой
UI SHALL соответствовать premium visual system: glass form card, hyphae background, motion при входе на экран.

#### Scenario: Визуальная индикация
- **WHEN** поле не прошло валидацию
- **THEN** рамка и текст ошибки с glow-red акцентом в стиле Hyphai

## ADDED Requirements

### Requirement: Premium auth layout
UI SHALL показывать экран входа в едином стиле с чатом: фон hyphae, glass card, display-типографика.

#### Scenario: Вход на auth
- **WHEN** пользователь не авторизован
- **THEN** видит полноэкранный branded layout с анимацией появления формы

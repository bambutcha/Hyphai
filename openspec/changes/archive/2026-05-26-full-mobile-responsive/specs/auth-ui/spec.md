## ADDED Requirements

### Requirement: Mobile layout auth
Экран входа/регистрации SHALL быть usable на 320px: форма с горизонтальными отступами, поля и primary CTA ≥44px по высоте, без горизонтального скролла.

#### Scenario: Форма на узком экране
- **WHEN** пользователь открывает AuthScreen на mobile
- **THEN** glass card занимает доступную ширину с padding; кнопка submit не обрезана

#### Scenario: Safe area
- **WHEN** устройство с notch
- **THEN** контент формы не прилипает к краям под системными inset

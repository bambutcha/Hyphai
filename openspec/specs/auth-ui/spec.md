# auth-ui Specification

## Purpose
TBD - created by archiving change ru-auth-validation. Update Purpose after archive.
## Requirements
### Requirement: Кастомная валидация полей
UI SHALL валидировать поля входа и регистрации на клиенте и показывать ошибки inline под полем, без нативных браузерных подсказок HTML5.

#### Scenario: Пустой email
- **WHEN** пользователь отправляет форму с пустым полем email
- **THEN** под полем email отображается сообщение «Введите email» на русском, запрос не отправляется

#### Scenario: Некорректный формат email
- **WHEN** пользователь вводит текст без формата email и отправляет форму
- **THEN** под полем email отображается «Некорректный email. Используйте формат name@example.com», запрос не отправляется

#### Scenario: Некорректный email on blur
- **WHEN** пользователь вводит некорректный email и переходит к следующему полю
- **THEN** под полем email отображается подсказка с корректным форматом на русском

#### Scenario: Короткий пароль
- **WHEN** пользователь вводит пароль короче 6 символов
- **THEN** под полем пароля отображается «Пароль должен быть не короче 6 символов»

#### Scenario: Пустое имя при регистрации
- **WHEN** пользователь на экране регистрации не заполняет имя и отправляет форму
- **THEN** под полем имени отображается «Введите имя»

### Requirement: Стиль полей с ошибкой
UI SHALL соответствовать premium visual system: glass form card, hyphae background, motion при входе на экран.

#### Scenario: Визуальная индикация
- **WHEN** поле не прошло валидацию
- **THEN** рамка и текст ошибки с glow-red акцентом в стиле Hyphai

### Requirement: Русские ошибки авторизации с API
UI SHALL показывать ошибки login/register на русском языке, включая ответы API.

#### Scenario: Неверные учётные данные
- **WHEN** API возвращает `Invalid credentials`
- **THEN** пользователь видит «Неверный email или пароль», а не английский текст

#### Scenario: Email уже занят
- **WHEN** API возвращает `Email already registered`
- **THEN** пользователь видит «Этот email уже зарегистрирован»

### Requirement: Premium auth layout
UI SHALL показывать экран входа в едином стиле с чатом: фон hyphae, glass card, display-типографика.

#### Scenario: Вход на auth
- **WHEN** пользователь не авторизован
- **THEN** видит полноэкранный branded layout с анимацией появления формы


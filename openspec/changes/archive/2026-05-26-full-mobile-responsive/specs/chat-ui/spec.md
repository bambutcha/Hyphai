## MODIFIED Requirements

### Requirement: Адаптивность
UI SHALL работать на desktop и mobile: off-canvas drawer для сайдбара на `<768px`, **полностью usable** область сообщений (шапка, лента, composer) без переполнения и с учётом safe-area.

#### Scenario: Мобильный drawer
- **WHEN** ширина экрана < 768px
- **THEN** сайдбар в drawer; чат на полную ширину; поле ввода и кнопка отправки не ломаются и не обрезаются

#### Scenario: Desktop
- **WHEN** ширина экрана >= 768px
- **THEN** сайдбар закреплён слева; layout шапки чата без регрессии

#### Scenario: Шапка чата на mobile
- **WHEN** viewport < 768px и открыт активный диалог
- **THEN** заголовок диалога читаем (truncate); селектор модели и вторичные действия (share, badge) помещаются без горизонтального overflow (перенос на вторую строку или stack)

#### Scenario: Composer на mobile
- **WHEN** пользователь фокусирует поле ввода на mobile
- **THEN** composer остаётся видимым над safe-area; кнопка «Отправить» сохраняет минимальную зону нажатия ≥44px

#### Scenario: Пузыри сообщений
- **WHEN** длинное слово или URL в сообщении на узком экране
- **THEN** текст переносится (`overflow-wrap`); пузырь не расширяет страницу шире viewport

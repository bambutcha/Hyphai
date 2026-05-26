# landing-page Specification

## Purpose
TBD - created by archiving change world-ready-product. Update Purpose after archive.
## Requirements
### Requirement: Landing до авторизации
UI SHALL показывать маркетинговую страницу на `/` для неавторизованных пользователей вместо немедленного экрана входа.

#### Scenario: Три блока
- **WHEN** гость открывает `/`
- **THEN** видит hero (название Hyphai + слоган), блок возможностей (≥3 пункта), CTA «Войти» / «Попробовать»

#### Scenario: Визуал hyphae
- **WHEN** landing отображается
- **THEN** присутствует декоративный hyphae-визуал или превью интерфейса (скрин/mock)

#### Scenario: Переход к auth
- **WHEN** гость жмёт CTA
- **THEN** открывается экран входа/регистрации (существующий AuthScreen)

#### Scenario: Авторизованный пользователь
- **WHEN** пользователь уже вошёл и открывает `/`
- **THEN** отображается основной ChatApp без landing

### Requirement: Mobile layout landing
Landing SHALL корректно отображаться на viewport 320px–767px: читаемая типографика, отступы, CTA без обрезки.

#### Scenario: Hero на mobile
- **WHEN** гость открывает `/` на телефоне
- **THEN** заголовок и слоган не выходят за экран; CTA на всю ширину или центрирован с min-height ≥44px

#### Scenario: Features grid
- **WHEN** ширина < 768px
- **THEN** блок возможностей в одну колонку с вертикальными отступами

#### Scenario: Preview block
- **WHEN** mock чата на landing
- **THEN** превью масштабируется внутри контейнера без horizontal scroll


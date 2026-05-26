## ADDED Requirements

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

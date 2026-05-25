## MODIFIED Requirements

### Requirement: Фоновая атмосфера hyphae
UI SHALL отображать анимированный декоративный фон (сеть/нити грибницы) на основных экранах без перегрузки контента. Световое пятно, следующее за курсором, SHALL обновляться через `transform`/`requestAnimationFrame` без CSS-transition на позиции длительностью >150ms и без React re-render на каждый `mousemove`.

#### Scenario: Ambient background
- **WHEN** пользователь в основном интерфейсе чата
- **THEN** виден тонкий анимированный hyphae-фон под glass-поверхностями; glow следует за курсором без заметного отставания

#### Scenario: Reduced motion
- **WHEN** `prefers-reduced-motion: reduce`
- **THEN** фон статичен или минимален; parallax за курсором отключён

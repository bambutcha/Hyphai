## Context

`HyphaeBackground` хранит `{x,y}` в React state и вешает `mousemove` на `window`. Каждое движение → re-render всего поддерева с фоном. Glow-орб позиционируется через `left`/`top` в % с `transition-[left,top] duration-700` — визуальная «инерция» 700ms создаёт ощущение, что эффект **не поспевает** за мышью и тормозит.

Поиск по `apps/web` не находит `cursor-pointer` — кнопки на `motion.button` и нативные `<button>` рендерятся с `cursor: default` (наследование body).

Premium redesign дал glass/motion, но не слой **interaction design** типичного SaaS.

## Goals / Non-Goals

**Goals:**

- Parallax glow следует за курсором с задержкой ≤ ~50ms (лёгкий lerp в rAF) или без transition-лага
- Все primary/secondary интерактивы показывают `cursor: pointer`
- `focus-visible` для keyboard navigation
- Единый паттерн hover/disabled через CSS utilities
- Зафиксировать в spec backlog оставшихся SaaS-элементов
- Отдельный mobile navigation refactor
- Замена LoadingState на полный skeleton framework


## Decisions

### 1. Parallax без React state на mousemove

**Решение:** ref на glow-элемент; в `mousemove` только записывать target coords; в `requestAnimationFrame` применять `transform: translate3d(...)` (или CSS vars `--hyphai-mx/my`). Убрать `transition` на left/top.

**Почему лаг сейчас:** связка `setState` + 700ms CSS transition.

**Альтернативы:**

| Вариант | Плюс | Минус |
|---------|------|-------|
| Оставить transition, уменьшить до 100ms | Просто | Всё ещё отстаёт |
| Убрать glow совсем | 0 jank | Теряем wow |
| rAF + transform (выбран) | GPU, без re-render | Чуть больше кода |

**Reduced motion:** не подписываться на mousemove; glow статичен по центру.

### 2. Interaction utilities в globals.css

**Решение:** классы:

- `.hyphai-interactive` → `cursor-pointer`, transition colors, `hover:` states
- `.hyphai-interactive:disabled` → `cursor-not-allowed`, opacity
- `.hyphai-focus` → `focus-visible:ring-2 focus-visible:ring-emerald-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950`

Применить к `GlowButton`, sidebar row buttons, retry/logout, Auth mode switch, ErrorBanner actions.

**Альтернатива:** только Tailwind `cursor-pointer` на каждом компоненте — хуже поддерживать.

### 3. GlowButton и native buttons

Добавить `cursor-pointer` в base classes `GlowButton`. Проверить `<button>` в sidebar/MessagePane/Auth — явный class или global:

```css
button:not(:disabled) { cursor: pointer; }
```

Осторожно: не трогать disabled submit.

### 4. SaaS gap backlog (не в этом apply целиком)

Зафиксировать в proposal/spec как future:

| Область | Сейчас | SaaS-уровень |
|---------|--------|----------------|
| Feedback | ErrorBanner | Toasts + inline success |
| Navigation mobile | stack layout | Drawer + overlay |
| Loading | текст LoadingState | skeleton shimmer |
| Discoverability | `title` на rename | Tooltip component |
| Density | ok | 8px grid tokens |
| Onboarding | empty states | product tour (опционально) |
| Commands | — | ⌘K palette |
| Settings | logout only | profile/theme |

## Risks / Trade-offs

- **[Risk]** Global `button { cursor: pointer }` затронет неинтерактивные кнопки → **Mitigation:** только `:not(:disabled)` + не использовать button для статики
- **[Risk]** rAF loop при неактивной вкладке → **Mitigation:** cancel rAF on blur / visibility hidden
- **[Trade-off]** Лёгкий lerp vs мгновенное следование — выбрать lerp ~0.12–0.18 для плавности без 700ms lag

## Migration Plan

1. Refactor `HyphaeBackground`
2. globals utilities + GlowButton
3. Пройти компоненты чеклистом interactive elements
4. `bun run build`, ручной smoke: pointer, parallax, Tab focus

Rollback: revert web-only diff.

## Open Questions

- Нужен ли mobile drawer в этом change или отложить? (по умолчанию — отложить)

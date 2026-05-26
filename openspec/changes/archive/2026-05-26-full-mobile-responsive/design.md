## Context

Текущее состояние:
- Drawer сайдбара на `<md` реализован в `ChatApp`.
- `MessagePane` header — один `flex-wrap` ряд с ModelSelector (`max-w-[11rem]`), share, badge — на 320px вылезает за экран.
- `layout.tsx` без `viewport` export с `viewportFit: 'cover'`.
- Toast `fixed bottom-4 right-4` без safe-area.
- Hamburger `fixed top-3 left-3` пересекается с контентом empty state.

Breakpoints: Tailwind `md` = 768px (согласовано с `mobile-shell`).

## Goals / Non-Goals

**Goals:**

- Нет горизонтального скролла на 320–428px width.
- Composer и toasts учитывают iOS home indicator.
- Все основные экраны usable one-handed.

**Non-Goals:** PWA, tablet-specific columns, landscape mockups.

## Decisions

### 1. Safe area через CSS variables

**Решение:** в `globals.css`:

```css
:root {
  --hyphai-safe-top: env(safe-area-inset-top, 0px);
  --hyphai-safe-bottom: env(safe-area-inset-bottom, 0px);
  ...
}
```

Применить к `body`, composer `pb`, toast container, fixed hamburger `top`.

**Решение Next:** `export const viewport: Viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover' }` в `layout.tsx`.

### 2. MessagePane header — stack на mobile

**Решение:**
- Row 1: menu + title (truncate)
- Row 2 (`md:hidden` или always wrap): model full width, share + badge в flex wrap

На `md+` — текущий single-row layout.

### 3. Composer

`padding-bottom: calc(1.5rem + var(--hyphai-safe-bottom))`; form `flex-col` на очень узком (<400) опционально — иначе `flex` с `min-w-0` input + shrink-0 button.

### 4. Overflow guard

`html, body { overflow-x: hidden }` + `max-w-full` на корневых layout wrappers.

### 5. ShareDialog

`max-h-[90dvh] overflow-y-auto` на mobile; кнопки `flex-col w-full` below `sm`.

### 6. Parallax на touch

`HyphaeBackground` — отключить mouse parallax на `pointer: coarse` (уже может быть в ui-interaction) — проверить при apply.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Desktop regression | тест 1280px после каждого блока |
| `dvh` vs `svh` на старых Safari | fallback `min-h-dvh` + safe padding |
| Двухрядная шапка выше | меньше места для ленты — acceptable |

## Migration Plan

Только deploy web; без API/DB.

## Open Questions

- Нужен ли bottom sheet для выбора модели вместо `<select>` на mobile — опционально в tasks как polish, default оставить native select full-width.

## Context

Текущий `ChatApp` всегда рендерит `MessagePane`; при `activeId === null` показывается disabled input — плохой UX. API: CRUD без update title. Стек: Tailwind 4, React 19, без animation-библиотек.

Эстетика Hyphai: zinc-950 фон, emerald акценты, метафора hyphae/грибницы.

## Goals / Non-Goals

**Goals:**

- Живой, продуманный UI с motion
- Два distinct empty state
- Rename inline в сайдбаре
- Сообщения и список с плавными анимациями
 framer-motion, shadcn full migration
- Backend beyond PATCH title

## Decisions

### 1. Layout: три режима главной области

```
activeId set     → MessagePane (composer всегда активен)
conversations>0, no active → ChatEmptyState variant="pick"
conversations=0          → ChatEmptyState variant="welcome"
```

**Rationale:** Убирает disabled composer; фокус на действии пользователя.

### 2. PATCH rename API

```http
PATCH /api/conversations/:id
{ "title": "Новое имя" }
→ 200 + conversation
```

Валидация: title 1–120 символов после trim; пустой → 400.

### 3. Rename UX в сайдбаре

**Choice:** Иконка карандаша при hover + Enter/Escape; или double-click на title → input inline.

**Choice:** Double-click на title → `contentEditable` или controlled input overlay.

**Rationale:** Привычный паттерн; не загромождает список.

### 4. Анимации (CSS-only)

| Элемент | Техника |
|---------|---------|
| Empty state | `fade-in` + лёгкий `scale-in` keyframes в `globals.css` |
| Список диалогов | `animation-delay` stagger через `style={{ animationDelay }}` |
| Сообщения | `animate-in` класс при mount (CSS `@keyframes message-in`) |
| Кнопки | `transition` hover scale 1.02, active scale 0.98 |
| Фон | subtle radial gradient emerald/zinc в main area |

**Alternative:** framer-motion — отклонено (non-goal, bundle size).

### 5. Визуальные компоненты

- `ChatEmptyState.tsx` — SVG/emoji hyphae illustration (CSS), заголовок, подзаголовок, CTA
- `HyphaeBackground.tsx` — декоративный gradient blob (optional, pure CSS)
- Обновить `ConversationSidebar` — card-style items, rename mode
- `MessagePane` — только когда есть activeId; bubble shadows, send button pulse on hover

### 6. Default title

API + web: `'Новый диалог'` вместо `'New conversation'`.

## Risks / Trade-offs

- **[Risk] prefers-reduced-motion** → Mitigation: `@media (prefers-reduced-motion: reduce)` отключает анимации
- **[Risk] Rename race** → Mitigation: disable save while loading, optimistic UI с rollback
- **[Trade-off] CSS animations less fancy than Framer** → достаточно для hackathon MVP

## Migration Plan

1. Deploy API (PATCH)
2. Deploy web
3. No DB migration

## Open Questions

(none)

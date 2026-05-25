## Why

После premium redesign остаются ощутимые UX-дефекты: **световое пятно фона** (`HyphaeBackground`) отстаёт от курсора из‑за `transition` 700ms + обновления React state на каждый `mousemove`; **ни один интерактивный элемент** не даёт `cursor: pointer`, хотя визуально выглядит кликабельным. Для уровня SaaS (Linear, Raycast) не хватает системных affordances: focus-кольца, единых hover/disabled, hit-area, производительного декоративного фона.

## What Changes

- **Производительность parallax**: убрать CSS-transition на позиции glow; обновлять координаты через `requestAnimationFrame` + DOM ref или CSS variables без лишних re-render
- **Affordances**: глобальные/компонентные правила `cursor-pointer` для `button`, ссылок, кликабельных строк сайдбара, `GlowButton`; `cursor-not-allowed` при `disabled`
- **Focus & keyboard**: видимый `focus-visible` на кнопках, инпутах, элементах списка
- **Hover consistency**: усилить hover на карточках диалогов, ghost-кнопках (logout, retry), иконках rename/delete
- **Touch targets**: минимальная зона нажатия ~44px на мобильных для основных CTA
- **SaaS polish (первая волна)**: tooltips/`title` на icon-only кнопках; единый класс `.hyphai-interactive` в `globals.css`; опционально лёгкий skeleton вместо только текстового LoadingState
- Документировать в spec **чеклист «до SaaS»** — что остаётся на следующие change (toasts, mobile drawer, command palette)
- Mobile off-canvas sidebar

## Capabilities

### New Capabilities

- `ui-interaction`: affordances курсора, focus, hover, hit-area, производительный ambient parallax

### Modified Capabilities

- `visual-design-system`: требования к фоновой атмосфере — performance и reduced-motion без лага
- `chat-ui`: интерактивные карточки диалогов и controls с явными pointer/focus/hover

## Impact

- `apps/web/components/visual/HyphaeBackground.tsx` — переписать движение glow
- `apps/web/app/globals.css` — utility-классы interaction
- `GlowButton`, `ConversationSidebar`, `MessagePane`, `AuthScreen`, `ErrorBanner`, UI primitives
- API без изменений

## Non-goals

- Кастомный SVG-курсор или «магнитные» кнопки
- Полноценная toast-система и command palette (отдельный change)
- Звук, haptics

## Hackathon demo

Навести курсор на «Новый чат» и строку диалога — **сразу pointer**; двигать мышь по фону — glow **следует без рывков и отставания**; Tab по интерфейсу — видны focus-кольца.

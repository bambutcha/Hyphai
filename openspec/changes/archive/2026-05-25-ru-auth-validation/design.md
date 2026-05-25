## Context

`AuthScreen` использует нативные атрибуты `required`, `type="email"`, `minLength={6}` — браузер показывает стандартные подсказки на языке ОС, не в стиле Hyphai. Ошибки API приходят на английском из `parseApiError()` и напрямую из `{ error: string }` бэкенда.

UI Hyphai: тёмная тема, emerald-акценты, красные inline-ошибки (`text-red-400`, `border-red-700`).

## Goals / Non-Goals

**Goals:**

- Все user-facing ошибки auth и общих UI-сбоев — на русском
- Inline-валидация под полем, без `noValidate` + custom logic
- Единый словарь перевода известных API-ошибок

**Non-goals:**

- i18n framework, EN/RU toggle
- Изменение текстов ошибок на API
- Zod/react-hook-form (достаточно лёгкой ручной валидации)

## Decisions

### 1. `lib/errors.ts` — `localizeErrorMessage(message: string): string`

**Choice:** Словарь `Record<string, string>` для точных совпадений + fallback для частичных паттернов.

**Примеры маппинга:**

| API / код | Русский |
|-----------|---------|
| `Invalid credentials` | Неверный email или пароль |
| `Session expired. Please sign in again.` | Сессия истекла. Войдите снова |
| `Email already registered` | Этот email уже зарегистрирован |
| `Cannot reach server. Check your connection.` | Не удалось связаться с сервером. Проверьте подключение |
| `Server error. Try again in a moment.` | Ошибка сервера. Попробуйте позже |

**Rationale:** API не трогаем; один слой на фронте. `getErrorMessage()` вызывает `localizeErrorMessage()` перед возвратом.

**Alternative:** Локализация на API — отклонено (non-goal).

### 2. `FormField` component

**Choice:** Обёртка: label (optional), input, error text под полем, красная рамка при ошибке.

```tsx
<FormField label="Email" error={errors.email} ... />
```

**Rationale:** Переиспользуемо; стиль совпадает с Hyphai.

### 3. Client validation in `lib/validateAuth.ts`

**Choice:** Чистые функции, возвращают `string | null` (текст ошибки на русском):

- `validateEmail(value)` — не пусто, формат email
- `validatePassword(value)` — мин. 6 символов
- `validateDisplayName(value)` — не пусто при регистрации

Валидация on submit; опционально on blur для UX.

**Choice:** `<form noValidate>` — отключаем браузерные popup.

### 4. Scope локализации chat errors

**Choice:** Локализовать через тот же `localizeErrorMessage()` все строки из `api.ts` и hardcoded fallback в ChatApp/ErrorBanner («Retry» → «Повторить»).

**Rationale:** Пользователь просил «нормальную обработку на русском» — не только auth.

## Risks / Trade-offs

- **[Risk] Новая ошибка API без перевода** → Mitigation: показывать оригинал или «Произошла ошибка»
- **[Risk] Дублирование строк** → Mitigation: один файл `errors.ts`
- **[Trade-off] Retry/Connected badges частично на EN в прошлом change** → переводим в этом change

## Migration Plan

Только фронтенд. Деплой web-контейнера. Откат — revert commit.

## Open Questions

(нет — scope ясен)

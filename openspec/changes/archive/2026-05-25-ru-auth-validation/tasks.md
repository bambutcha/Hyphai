## 1. Локализация ошибок

- [x] 1.1 Создать `apps/web/lib/errors.ts` со словарём `localizeErrorMessage()`
- [x] 1.2 Подключить локализацию в `getErrorMessage()` / `parseApiError()` fallback-строки на русском
- [x] 1.3 Перевести hardcoded строки в ChatApp, ErrorBanner, LoadingState, ConnectionBadge

## 2. Валидация auth

- [x] 2.1 Создать `apps/web/lib/validateAuth.ts` — validateEmail, validatePassword, validateDisplayName
- [x] 2.2 Создать `apps/web/components/ui/FormField.tsx` — input + inline error + error border

## 3. AuthScreen

- [x] 3.1 Переписать форму с `noValidate`, FormField и клиентской валидацией on submit
- [x] 3.2 Показывать локализованные API-ошибки через `localizeErrorMessage`
- [x] 3.3 Убрать нативные `required`, `minLength`, `type="email"` (заменить на `type="text"` + custom check)

## 4. Проверка

- [x] 4.1 Неверный пароль → «Неверный email или пароль»
- [x] 4.2 Пустой/кривой email → inline-ошибка на русском, без browser popup
- [x] 4.3 Остановка API → русское сообщение о сети + «Повторить»

## 5. Валидация on blur (доп. из spec)

- [x] 5.1 Показывать ошибку email/пароля при переходе к следующему полю (onBlur), без submit
- [x] 5.2 Сообщения on blur/submit объясняют, как должно быть правильно (формат email, длина пароля)

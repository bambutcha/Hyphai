## 1. Конфигурация

- [x] 1.1 Добавить `OPENROUTER_API_KEY`, `OPENROUTER_MODEL`, `OPENROUTER_TIMEOUT_MS`, `OPENROUTER_APP_URL` в `.env.example` и README
- [x] 1.2 Документировать получение бесплатного ключа на openrouter.ai

## 2. LLM модуль (API)

- [x] 2.1 `apps/api/src/llm/openrouter.ts` — fetch chat completions, типы, таймаут
- [x] 2.2 `apps/api/src/llm/prompt.ts` — system prompt Hyphai (RU)
- [x] 2.3 Сборка messages из истории БД (limit 20)

## 3. Интеграция в route

- [x] 3.1 Заменить echo в `POST /:id/messages` на вызов OpenRouter
- [x] 3.2 Ошибки: 503 no key, 502 unavailable/rate limit, 504 timeout — ключи `error` для фронта
- [x] 3.3 WS `messages.created` только после успешной пары user+assistant

## 4. Web

- [x] 4.1 `apps/web/lib/errors.ts` — маппинг LLM error keys на русский
- [x] 4.2 Проверить sending state при долгом ответе (без изменений логики, если уже ок)

## 5. Verification

- [x] 5.1 `bun run build` (api + web) или typecheck
- [x] 5.2 С ключом: отправить сообщение → ответ assistant не echo
- [x] 5.3 Без ключа: 503 и русский баннер
- [x] 5.4 Hackathon path: login → chat → вопрос про hyphae → осмысленный RU ответ

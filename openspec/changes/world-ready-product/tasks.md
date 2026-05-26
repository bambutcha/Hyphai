## Волна A — «вау за 60 секунд» (apply first)

### A1 Streaming

- [x] A1.1 OpenRouter `stream: true` в `llm/openrouter.ts`
- [x] A1.2 `POST /conversations/:id/messages/stream` SSE (user_message, chunk, done, error)
- [x] A1.3 Web: `sendMessageStream()` + EventSource/fetch reader
- [x] A1.4 MessagePane: partial assistant bubble + finalize
- [x] A1.5 WS `messages.created` после stream complete

### A2 Markdown

- [x] A2.1 `react-markdown` + `remark-gfm` + sanitize
- [x] A2.2 `MessageMarkdown.tsx` + стили `.message-markdown`
- [x] A2.3 Assistant bubbles используют markdown renderer

### A3 Landing

- [x] A3.1 `LandingPage.tsx` — hero, features, CTA
- [x] A3.2 `app/page.tsx` — guest → landing, authed → ChatApp
- [x] A3.3 Hyphae preview / mock screenshot block
- [x] A3.4 `ui-text.ts` строки landing

### A4 Mobile drawer

- [x] A4.1 Hamburger + drawer state в ChatApp
- [x] A4.2 Overlay backdrop, motion slide-in
- [x] A4.3 Закрытие при select conversation / backdrop click
- [x] A4.4 `md:` breakpoint — desktop без drawer

### A5 Verification A

- [x] A5.1 `bun run build`
- [x] A5.2 Demo 60s: landing → login → stream answer → mobile drawer

---

## Волна B — «верят, что это продукт»

### B1 Product feedback

- [ ] B1.1 `ToastProvider` + hook
- [ ] B1.2 Toasts: rename, delete, create chat success/error
- [ ] B1.3 Skeleton components для sidebar + messages

### B2 LLM transparency

- [ ] B2.1 API: `modelUsed`, `requestedModel`, `usedFallback` в done/sync response
- [ ] B2.2 `ModelBadge.tsx` в MessagePane header или под bubble

### B3 CI + Deploy

- [ ] B3.1 `.github/workflows/ci.yml`
- [ ] B3.2 README «Deploy in 5 min» + prod env table
- [ ] B3.3 Документация stable/paid OPENROUTER_MODEL для public instance

### B4 Verification B

- [ ] B4.1 CI green on PR
- [ ] B4.2 Fallback badge visible when Gemma → GPT-OSS

---

## Волна C — «живая сеть» (vision, optional archive)

### C1 Schema

- [ ] C1.1 Migration: `parent_id`, `share_slug` on conversations
- [ ] C1.2 API fork conversation from message
- [ ] C1.3 API enable/disable share + public GET share

### C2 UI network

- [ ] C2.1 «Ветка» action на message bubble
- [ ] C2.2 Share dialog + public share page (read-only)
- [ ] C2.3 `HyphaeGraphEmpty.tsx` на welcome empty state

### C3 Verification C

- [ ] C3.1 Fork → new chat with parent link
- [ ] C3.2 Share URL opens without auth

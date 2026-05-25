## Context

Hyphai web app (`apps/web`) uses a single `error` string in `ChatApp` rendered as a red banner. `api.ts` throws `new Error(body || res.statusText)` where `body` is often raw JSON from Hono. Auth errors in `AuthScreen` show the same raw text. There are no loading spinners for initial fetches, no retry buttons, and `connectConversationWs` swallows parse errors with no user feedback.

Stack constraints: frontend-only change; API error shapes stay as-is.

## Goals / Non-Goals

**Goals:**

- Human-readable error messages for common failure modes (network, 401, 422, 5xx)
- Consistent loading and error UI across auth, sidebar, and message pane
- Retry without full page reload
- Visible WebSocket connection status when realtime drops

**Non-Goals:**

- Changing API error response format
- Error tracking / analytics
- Offline message queue
- Russian localization (English strings for this change)

## Decisions

### 1. `ApiError` class + `parseApiError()` in `lib/api.ts`

**Choice:** Wrap fetch failures in a typed `ApiError` with `status`, `code`, and `userMessage`.

**Rationale:** Centralizes parsing once; components consume `userMessage` only.

**Parsing rules:**

| Condition | User message |
|-----------|--------------|
| `fetch` throws (network) | "Cannot reach server. Check your connection." |
| 401 | "Session expired. Please sign in again." (+ clear token, redirect to auth) |
| 422 / 400 with `{ error: string }` | Use `error` field |
| 5xx | "Server error. Try again in a moment." |
| Other | Fallback to status text or generic message |

**Alternative considered:** Per-component parsing — rejected (duplication).

### 2. Shared UI components in `components/ui/`

**Choice:** Small presentational components:

- `ErrorBanner` — dismissible, optional retry callback
- `LoadingState` — centered spinner + label
- `InlineError` — for form-level errors (auth)
- `ConnectionBadge` — subtle dot + label in message pane header

**Rationale:** Keeps Hyphai aesthetic consistent; easy to demo.

### 3. Loading state model in `ChatApp`

**Choice:** Separate flags: `loadingConversations`, `loadingMessages`, plus existing `sending`.

**Rationale:** Avoids one global loader blocking unrelated UI.

### 4. WebSocket lifecycle in `lib/ws.ts`

**Choice:** Extend `connectConversationWs` to accept optional `onConnectionChange(status: 'connecting' | 'connected' | 'disconnected')`.

**Rationale:** Minimal API change; `ChatApp` drives `ConnectionBadge`.

**Alternative considered:** Auto-reconnect with exponential backoff — deferred (non-goal complexity).

### 5. Retry pattern

**Choice:** Error banner and inline empty states expose "Retry" that re-invokes the last failed action (load conversations, load messages, send).

**Rationale:** Hackathon demo: stop/start Docker API and click Retry.

## Risks / Trade-offs

- **[Risk] API returns non-JSON error bodies** → Mitigation: try `JSON.parse`, fall back to trimmed text capped at 120 chars
- **[Risk] 401 during background refresh logs user out unexpectedly** → Mitigation: only force logout on 401 from authenticated routes, show message once
- **[Risk] Multiple simultaneous errors overwrite single `error` state** → Mitigation: scope errors per region (auth inline, chat banner) — already split between AuthScreen and ChatApp
- **[Trade-off] No auto-reconnect for WS** → User sees "Disconnected" badge; manual refresh or re-select conversation acceptable for MVP

## Migration Plan

1. Ship frontend changes only — no DB migration
2. Deploy web container / redeploy static build
3. Rollback: revert web commit; API unchanged

## Open Questions

(none — scope is well bounded for hackathon MVP)

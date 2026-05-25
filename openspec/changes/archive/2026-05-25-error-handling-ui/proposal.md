## Why

Hyphai already surfaces API failures as a raw red banner, but errors are hard to understand (JSON bodies, no retry), loading states are missing, and WebSocket failures are silent. For the hackathon demo, the chat must feel reliable and polished when the API is down, auth fails, or the network drops.

## What Changes

- Parse API error responses into human-readable messages (validation, 401, 5xx, network)
- Reusable error/loading/empty UI components aligned with the Hyphai dark theme
- Loading indicators for auth, conversation list, and message history
- Inline retry actions for failed loads and sends
- Dismissible error banner with optional auto-clear on success
- Connection status indicator when WebSocket disconnects or reconnects
- Empty and error states in sidebar and message pane (not just blank screens)

## Capabilities

### New Capabilities

(none — error handling extends existing UI behavior)

### Modified Capabilities

- `chat-ui`: add requirements for loading states, user-friendly errors, retry, and connection feedback

## Impact

- `apps/web/lib/api.ts` — structured error parsing from API responses
- `apps/web/lib/ws.ts` — connection lifecycle callbacks (open, close, error)
- `apps/web/components/` — new shared UI primitives; updates to `ChatApp`, `AuthScreen`, `MessagePane`, `ConversationSidebar`
- No API or database changes required

## Non-goals

- Backend error format overhaul (use existing JSON/text bodies as-is)
- Global error monitoring (Sentry, etc.)
- Offline queue / message persistence when API is unavailable
- i18n — English UI strings only for this change

## Hackathon demo

Demo should show: stop API container → user sees clear error + retry; restart API → retry succeeds. Auth with wrong password shows a readable message, not raw JSON.

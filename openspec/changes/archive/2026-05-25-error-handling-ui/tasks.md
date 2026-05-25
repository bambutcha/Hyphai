## 1. API client errors

- [x] 1.1 Add `ApiError` class and `parseApiError()` in `apps/web/lib/api.ts`
- [x] 1.2 Update `request()` to throw `ApiError` with `userMessage` for network, 401, 4xx, 5xx
- [x] 1.3 Export helper to detect 401 and trigger logout from `ChatApp`

## 2. Shared UI components

- [x] 2.1 Create `components/ui/ErrorBanner.tsx` (message, onDismiss, optional onRetry)
- [x] 2.2 Create `components/ui/LoadingState.tsx` (spinner + label)
- [x] 2.3 Create `components/ui/ConnectionBadge.tsx` (connected / disconnected / connecting)

## 3. WebSocket lifecycle

- [x] 3.1 Extend `connectConversationWs` with `onConnectionChange` callback
- [x] 3.2 Wire connection status in `ChatApp` and show `ConnectionBadge` in message header

## 4. ChatApp integration

- [x] 4.1 Add `loadingConversations` and `loadingMessages` flags with `LoadingState` in sidebar and pane
- [x] 4.2 Replace raw error banner with `ErrorBanner` (dismiss + retry for load/send failures)
- [x] 4.3 Handle 401: clear token, show message, return to auth screen
- [x] 4.4 Preserve draft on failed send; retry reuses same content

## 5. Auth and child components

- [x] 5.1 Update `AuthScreen` to show `ApiError.userMessage` via inline error styling
- [x] 5.2 Add error empty state in `ConversationSidebar` when list load fails (with retry prop)
- [x] 5.3 Add error empty state in `MessagePane` when messages load fails (with retry prop)

## 6. Verification

- [x] 6.1 Manual test: stop API → error + retry → restart API → retry succeeds
- [x] 6.2 Manual test: wrong password shows readable message (not JSON)
- [x] 6.3 Manual test: WebSocket badge updates when redis/api restarts

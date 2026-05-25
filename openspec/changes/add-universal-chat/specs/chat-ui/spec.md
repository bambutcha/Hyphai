## ADDED Requirements

### Requirement: Conversation sidebar
The UI SHALL display a list of conversations with ability to create and select one.

#### Scenario: Sidebar shows conversations
- **WHEN** user opens the app
- **THEN** a sidebar lists conversation titles fetched from the API

#### Scenario: Create new chat
- **WHEN** user clicks "New chat"
- **THEN** a new conversation is created via API and becomes active

### Requirement: Message pane
The UI SHALL show messages for the selected conversation and an input to send new ones.

#### Scenario: View messages
- **WHEN** user selects a conversation
- **THEN** message history is displayed with user messages on the right and assistant on the left

#### Scenario: Send message
- **WHEN** user types text and presses Enter or clicks Send
- **THEN** the message is sent to the API and the view updates with user + assistant reply

### Requirement: Visual identity
The UI SHALL use a dark theme with hyphae/mycelium-inspired accent colors (green/emerald tones).

#### Scenario: Dark theme default
- **WHEN** user loads the app
- **THEN** background is dark and accent color is emerald/green

### Requirement: Responsive layout
The UI SHALL work on desktop and mobile viewports.

#### Scenario: Mobile
- **WHEN** viewport width is below 768px
- **THEN** sidebar collapses or stacks without breaking message input

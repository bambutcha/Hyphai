## ADDED Requirements

### Requirement: List messages in conversation
The system SHALL return all messages for a conversation ordered by created_at ascending.

#### Scenario: Empty conversation
- **WHEN** a conversation has no messages
- **THEN** the API returns an empty array

#### Scenario: Ordered history
- **WHEN** a conversation has three messages sent at different times
- **THEN** messages are returned oldest-first

### Requirement: Send user message
The system SHALL accept a user message and persist it to PostgreSQL.

#### Scenario: Valid message
- **WHEN** client sends `{ "content": "Hello" }` to a valid conversation
- **THEN** a message with role `user` is stored and returned with id and timestamp

#### Scenario: Empty content rejected
- **WHEN** client sends `{ "content": "" }` or whitespace-only content
- **THEN** the API returns HTTP 400

### Requirement: Assistant echo reply
The system SHALL automatically create an assistant reply after each user message.

#### Scenario: Echo after send
- **WHEN** user sends "Hello"
- **THEN** an assistant message is stored with content acknowledging the user input (echo/placeholder)

### Requirement: Conversation updated_at on new message
The system SHALL update the parent conversation's updated_at when a message is sent.

#### Scenario: Timestamp bump
- **WHEN** a new message is sent to a conversation
- **THEN** that conversation's updated_at reflects the latest message time

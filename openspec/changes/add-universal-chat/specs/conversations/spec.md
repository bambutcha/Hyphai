## ADDED Requirements

### Requirement: List conversations
The system SHALL return all conversations ordered by most recently updated first.

#### Scenario: Empty state
- **WHEN** no conversations exist
- **THEN** the API returns an empty array

#### Scenario: Multiple conversations
- **WHEN** three conversations exist with different updated_at timestamps
- **THEN** the API returns all three sorted by updated_at descending

### Requirement: Create conversation
The system SHALL allow creating a new conversation with an optional title.

#### Scenario: Create with title
- **WHEN** client sends `{ "title": "Project chat" }`
- **THEN** a new conversation is created and returned with a UUID id and the given title

#### Scenario: Create without title
- **WHEN** client sends `{}` or `{ "title": null }`
- **THEN** a new conversation is created with title "New conversation"

### Requirement: Get conversation by id
The system SHALL return a single conversation when given a valid UUID.

#### Scenario: Found
- **WHEN** client requests an existing conversation id
- **THEN** the conversation object is returned

#### Scenario: Not found
- **WHEN** client requests a non-existent id
- **THEN** the API returns HTTP 404

### Requirement: Delete conversation
The system SHALL delete a conversation and all its messages.

#### Scenario: Successful delete
- **WHEN** client deletes an existing conversation
- **THEN** the conversation and its messages are removed and API returns HTTP 204

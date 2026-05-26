# message-markdown Specification

## Purpose
TBD - created by archiving change world-ready-product. Update Purpose after archive.
## Requirements
### Requirement: Markdown в сообщениях assistant
UI SHALL рендерить содержимое assistant messages как безопасный Markdown (параграфы, списки, inline code, code blocks).

#### Scenario: Code block
- **WHEN** assistant вернул текст с fenced code block
- **THEN** в bubble отображается форматированный блок кода с моноширинным шрифтом

#### Scenario: Безопасность
- **WHEN** assistant вернул HTML или script в markdown
- **THEN** опасные теги не исполняются (sanitize)

#### Scenario: User messages
- **WHEN** user message содержит markdown-символы
- **THEN** user bubble MAY оставаться plain text (минимум A) или рендериться как markdown (опционально)


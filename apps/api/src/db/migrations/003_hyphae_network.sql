ALTER TABLE conversations
  ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES conversations(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS fork_from_message_id UUID REFERENCES messages(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS share_slug TEXT UNIQUE;

CREATE INDEX IF NOT EXISTS conversations_share_slug_idx
  ON conversations (share_slug)
  WHERE share_slug IS NOT NULL;

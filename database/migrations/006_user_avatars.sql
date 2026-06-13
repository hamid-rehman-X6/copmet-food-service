-- User profile avatars.
--
-- Avatar binaries are kept in a dedicated table (not on the users row) so the
-- hot auth queries stay lean and never load image bytes. One avatar per user;
-- uploading again replaces the existing row. Images are validated in the
-- application layer (allowed types, size, and signature) before being stored.

CREATE TABLE IF NOT EXISTS user_avatars (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  -- Validated MIME type (image/png, image/jpeg, or image/webp).
  mime_type VARCHAR(40) NOT NULL,
  -- Stored size in bytes, used for sanity checks and reporting.
  byte_size INTEGER NOT NULL CHECK (byte_size > 0),
  -- Raw image bytes.
  data BYTEA NOT NULL,
  -- Bumped on every upload; the client uses it to cache-bust the avatar URL.
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

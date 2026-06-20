-- Editable profile for the environment-based admin account (display name +
-- Cloudinary profile photo). The admin has no users row, so this single-row
-- table holds the data. The CHECK pins it to exactly one row (id = 1).

CREATE TABLE IF NOT EXISTS admin_profile (
  id SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  display_name TEXT,
  avatar_url TEXT,
  avatar_public_id TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed the singleton row so every later write is a simple update.
INSERT INTO admin_profile (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

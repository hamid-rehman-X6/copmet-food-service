-- WhatsApp numbers that receive placed orders. Replaces the single ADMIN_WHATSAPP
-- env var: the admin manages numbers in the settings panel, and orders are sent
-- to every number whose is_active flag is true.

CREATE TABLE IF NOT EXISTS admin_whatsapp_numbers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT,
  -- Digits only, international format (e.g. 923001234567). Unique to avoid dupes.
  phone TEXT NOT NULL UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Order placement only ever queries the active numbers, so index that path.
CREATE INDEX IF NOT EXISTS idx_admin_whatsapp_active
  ON admin_whatsapp_numbers (created_at)
  WHERE is_active;

-- Saved default delivery details on the user account.
--
-- These let a returning customer's checkout form pre-fill automatically. They
-- are optional and independent of any specific order (orders keep their own
-- delivery snapshot). The contact name is taken from the account, so only the
-- phone and address fields are stored here.

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS default_phone VARCHAR(40),
  ADD COLUMN IF NOT EXISTS default_address TEXT,
  ADD COLUMN IF NOT EXISTS default_city VARCHAR(120),
  ADD COLUMN IF NOT EXISTS default_postal_code VARCHAR(20),
  ADD COLUMN IF NOT EXISTS default_instructions TEXT;

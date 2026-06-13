-- Application settings.
--
-- A single-row table that holds store-wide configuration the admin can edit at
-- runtime. The currency is stored here (not hardcoded) so switching from PKR to
-- USD — or any other currency — is purely an admin action that requires no code
-- changes. Prices are stored as plain amounts and are never converted; only the
-- display format changes when the currency code/locale changes.

CREATE TABLE IF NOT EXISTS app_settings (
  -- Guard column that constrains the table to exactly one row (a singleton).
  id INTEGER PRIMARY KEY DEFAULT 1,
  -- ISO 4217 currency code used for display (e.g. PKR, USD).
  currency_code VARCHAR(3) NOT NULL DEFAULT 'PKR',
  -- BCP 47 locale used by Intl.NumberFormat when rendering money (e.g. en-PK).
  currency_locale VARCHAR(20) NOT NULL DEFAULT 'en-PK',
  -- Flat delivery fee applied when an order is below the free-delivery threshold.
  delivery_fee NUMERIC(12, 2) NOT NULL DEFAULT 250 CHECK (delivery_fee >= 0),
  -- Order subtotal at or above which delivery becomes free.
  free_delivery_threshold NUMERIC(12, 2) NOT NULL DEFAULT 5000 CHECK (free_delivery_threshold >= 0),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT app_settings_singleton CHECK (id = 1)
);

-- Seed the single settings row with PKR defaults.
INSERT INTO app_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

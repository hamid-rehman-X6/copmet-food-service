-- Frozen food catalog: categories and products.
--
-- Products belong to a category and carry pricing, availability status, dietary
-- tags, and merchandising metadata (rating/popularity) used to sort the public
-- storefront. Prices are stored as plain NUMERIC amounts in the store currency
-- (see app_settings) and are never currency-converted in code.

-- Product availability lifecycle.
DO $$
BEGIN
  CREATE TYPE product_status AS ENUM ('ACTIVE', 'INACTIVE', 'OUT_OF_STOCK', 'DRAFT');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(80) NOT NULL UNIQUE,
  -- URL/filter-friendly identifier derived from the name.
  slug VARCHAR(100) NOT NULL UNIQUE,
  -- Controls display order in storefront filters and admin lists.
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(160) NOT NULL,
  -- Stable, unique identifier used by the storefront and order snapshots.
  slug VARCHAR(180) NOT NULL UNIQUE,
  description TEXT NOT NULL DEFAULT '',
  -- RESTRICT prevents deleting a category that still has products.
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
  status product_status NOT NULL DEFAULT 'DRAFT',
  -- Dietary/marketing tags such as Vegan, GF, Organic, Nut-Free.
  tags TEXT[] NOT NULL DEFAULT '{}',
  image_url TEXT NOT NULL DEFAULT '',
  image_alt VARCHAR(200) NOT NULL DEFAULT '',
  rating NUMERIC(2, 1) NOT NULL DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  popularity INTEGER NOT NULL DEFAULT 0 CHECK (popularity >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes tuned for the common access patterns: filter by category/status and
-- order by recency or popularity.
CREATE INDEX IF NOT EXISTS products_category_id_idx ON products(category_id);
CREATE INDEX IF NOT EXISTS products_status_idx ON products(status);
CREATE INDEX IF NOT EXISTS products_created_at_idx ON products(created_at DESC);
CREATE INDEX IF NOT EXISTS products_popularity_idx ON products(popularity DESC);

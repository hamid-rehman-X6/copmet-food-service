-- Customer orders and their line items.
--
-- An order is placed by a registered customer and captures point-in-time
-- snapshots of pricing, the store currency, and the delivery contact details so
-- historical orders stay accurate even if products, prices, or settings change
-- later. Line items also snapshot the product name/image/price for the same
-- reason, while keeping a nullable reference back to the live product.

-- Order fulfilment lifecycle. Mirrors the cold-delivery workflow used in the
-- admin UI (Pending -> Packing -> Out for Delivery -> Delivered, or Cancelled).
DO $$
BEGIN
  CREATE TYPE order_status AS ENUM ('PENDING', 'PACKING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Human-friendly reference shown to customers and admins (e.g. ORD-8A3F2C).
  reference VARCHAR(20) NOT NULL UNIQUE,
  -- RESTRICT keeps order history intact; customers are deactivated, not deleted.
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  status order_status NOT NULL DEFAULT 'PENDING',

  -- Monetary snapshot at the time the order was placed.
  subtotal NUMERIC(12, 2) NOT NULL CHECK (subtotal >= 0),
  delivery_fee NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (delivery_fee >= 0),
  total NUMERIC(12, 2) NOT NULL CHECK (total >= 0),
  currency_code VARCHAR(3) NOT NULL,

  -- Delivery contact + address snapshot.
  contact_first_name VARCHAR(80) NOT NULL,
  contact_last_name VARCHAR(80) NOT NULL,
  contact_phone VARCHAR(40),
  delivery_address TEXT NOT NULL,
  delivery_city VARCHAR(120) NOT NULL,
  delivery_postal_code VARCHAR(20),
  delivery_instructions TEXT,

  placed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS orders_user_id_idx ON orders(user_id);
CREATE INDEX IF NOT EXISTS orders_status_idx ON orders(status);
CREATE INDEX IF NOT EXISTS orders_placed_at_idx ON orders(placed_at DESC);

CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  -- SET NULL keeps the line item (with its snapshot) if the product is removed.
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,

  -- Snapshot of the purchased product so receipts never change retroactively.
  product_name VARCHAR(160) NOT NULL,
  product_image_url TEXT NOT NULL DEFAULT '',
  unit_price NUMERIC(12, 2) NOT NULL CHECK (unit_price >= 0),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  line_total NUMERIC(12, 2) NOT NULL CHECK (line_total >= 0)
);

CREATE INDEX IF NOT EXISTS order_items_order_id_idx ON order_items(order_id);
CREATE INDEX IF NOT EXISTS order_items_product_id_idx ON order_items(product_id);

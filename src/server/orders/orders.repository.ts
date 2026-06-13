import type { PoolClient, QueryResultRow } from "pg";
import { query } from "@/server/db/pool";
import type { OrderDetail, OrderItem, OrderStatus, OrderSummary } from "@/types/order.types";

// --- Row types ------------------------------------------------------------

type OrderSummaryRow = QueryResultRow & {
  id: string;
  reference: string;
  status: OrderStatus;
  total: string;
  currency_code: string;
  placed_at: Date;
  item_count: number;
  customer_id: string;
  first_name: string;
  last_name: string;
  email: string;
};

type OrderDetailRow = OrderSummaryRow & {
  subtotal: string;
  delivery_fee: string;
  contact_first_name: string;
  contact_last_name: string;
  contact_phone: string | null;
  delivery_address: string;
  delivery_city: string;
  delivery_postal_code: string | null;
  delivery_instructions: string | null;
  updated_at: Date;
};

type OrderItemRow = QueryResultRow & {
  id: string;
  product_id: string | null;
  product_name: string;
  product_image_url: string;
  unit_price: string;
  quantity: number;
  line_total: string;
};

// --- Mappers --------------------------------------------------------------

function toCustomer(row: OrderSummaryRow) {
  return {
    id: row.customer_id,
    name: `${row.first_name} ${row.last_name}`.trim(),
    email: row.email,
  };
}

function toOrderSummary(row: OrderSummaryRow): OrderSummary {
  return {
    id: row.id,
    reference: row.reference,
    status: row.status,
    total: Number(row.total),
    currencyCode: row.currency_code,
    itemCount: row.item_count,
    placedAt: row.placed_at.toISOString(),
    customer: toCustomer(row),
  };
}

function toOrderItem(row: OrderItemRow): OrderItem {
  return {
    id: row.id,
    productId: row.product_id,
    name: row.product_name,
    imageUrl: row.product_image_url,
    unitPrice: Number(row.unit_price),
    quantity: row.quantity,
    lineTotal: Number(row.line_total),
  };
}

function toOrderDetail(row: OrderDetailRow, items: OrderItem[]): OrderDetail {
  return {
    ...toOrderSummary(row),
    subtotal: Number(row.subtotal),
    deliveryFee: Number(row.delivery_fee),
    contact: {
      firstName: row.contact_first_name,
      lastName: row.contact_last_name,
      phone: row.contact_phone,
    },
    delivery: {
      address: row.delivery_address,
      city: row.delivery_city,
      postalCode: row.delivery_postal_code,
      instructions: row.delivery_instructions,
    },
    items,
    updatedAt: row.updated_at.toISOString(),
  };
}

// --- Listing --------------------------------------------------------------

export type OrderListFilters = {
  status?: OrderStatus;
  search?: string;
  userId?: string;
};

function buildWhere(filters: OrderListFilters) {
  const conditions: string[] = [];
  const values: unknown[] = [];

  if (filters.userId) {
    values.push(filters.userId);
    conditions.push(`o.user_id = $${values.length}`);
  }

  if (filters.status) {
    values.push(filters.status);
    conditions.push(`o.status = $${values.length}::order_status`);
  }

  if (filters.search) {
    values.push(`%${filters.search}%`);
    const placeholder = `$${values.length}`;
    conditions.push(
      `(o.reference ILIKE ${placeholder} OR u.email ILIKE ${placeholder} OR (u.first_name || ' ' || u.last_name) ILIKE ${placeholder})`,
    );
  }

  const clause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  return { clause, values };
}

const SUMMARY_SELECT = `
  SELECT o.id, o.reference, o.status, o.total, o.currency_code, o.placed_at,
         u.id AS customer_id, u.first_name, u.last_name, u.email,
         COALESCE((SELECT SUM(oi.quantity) FROM order_items oi WHERE oi.order_id = o.id), 0)::int AS item_count
  FROM orders o
  JOIN users u ON u.id = o.user_id
`;

export async function countOrders(filters: OrderListFilters) {
  const { clause, values } = buildWhere(filters);
  const result = await query<{ count: string }>(
    `SELECT COUNT(*)::int AS count FROM orders o JOIN users u ON u.id = o.user_id ${clause}`,
    values,
  );

  return result.rows[0] ? Number(result.rows[0].count) : 0;
}

export async function listOrders(
  filters: OrderListFilters,
  limit: number,
  offset: number,
): Promise<OrderSummary[]> {
  const { clause, values } = buildWhere(filters);
  values.push(limit, offset);

  const result = await query<OrderSummaryRow>(
    `${SUMMARY_SELECT} ${clause}
     ORDER BY o.placed_at DESC
     LIMIT $${values.length - 1} OFFSET $${values.length}`,
    values,
  );

  return result.rows.map(toOrderSummary);
}

// --- Detail ---------------------------------------------------------------

export async function findOrderDetail(id: string, userId?: string): Promise<OrderDetail | null> {
  const values: unknown[] = [id];
  let scope = "";

  if (userId) {
    values.push(userId);
    scope = `AND o.user_id = $${values.length}`;
  }

  const orderResult = await query<OrderDetailRow>(
    `SELECT o.id, o.reference, o.status, o.subtotal, o.delivery_fee, o.total, o.currency_code,
            o.contact_first_name, o.contact_last_name, o.contact_phone,
            o.delivery_address, o.delivery_city, o.delivery_postal_code, o.delivery_instructions,
            o.placed_at, o.updated_at,
            u.id AS customer_id, u.first_name, u.last_name, u.email,
            COALESCE((SELECT SUM(oi.quantity) FROM order_items oi WHERE oi.order_id = o.id), 0)::int AS item_count
     FROM orders o
     JOIN users u ON u.id = o.user_id
     WHERE o.id = $1 ${scope}
     LIMIT 1`,
    values,
  );

  const orderRow = orderResult.rows[0];
  if (!orderRow) {
    return null;
  }

  const itemsResult = await query<OrderItemRow>(
    `SELECT id, product_id, product_name, product_image_url, unit_price, quantity, line_total
     FROM order_items
     WHERE order_id = $1
     ORDER BY product_name ASC`,
    [id],
  );

  return toOrderDetail(orderRow, itemsResult.rows.map(toOrderItem));
}

// --- Mutations ------------------------------------------------------------

export type NewOrder = {
  reference: string;
  userId: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
  currencyCode: string;
  contactFirstName: string;
  contactLastName: string;
  contactPhone: string | null;
  deliveryAddress: string;
  deliveryCity: string;
  deliveryPostalCode: string | null;
  deliveryInstructions: string | null;
};

export type NewOrderItem = {
  productId: string;
  productName: string;
  productImageUrl: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
};

/** Insert an order and its line items inside the provided transaction client. */
export async function insertOrder(client: PoolClient, order: NewOrder, items: NewOrderItem[]): Promise<string> {
  const orderResult = await client.query<{ id: string }>(
    `INSERT INTO orders
       (reference, user_id, subtotal, delivery_fee, total, currency_code,
        contact_first_name, contact_last_name, contact_phone,
        delivery_address, delivery_city, delivery_postal_code, delivery_instructions)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
     RETURNING id`,
    [
      order.reference,
      order.userId,
      order.subtotal,
      order.deliveryFee,
      order.total,
      order.currencyCode,
      order.contactFirstName,
      order.contactLastName,
      order.contactPhone,
      order.deliveryAddress,
      order.deliveryCity,
      order.deliveryPostalCode,
      order.deliveryInstructions,
    ],
  );

  const orderId = orderResult.rows[0].id;

  // Build a single multi-row INSERT for all line items (7 columns each).
  const valuePlaceholders: string[] = [];
  const itemValues: unknown[] = [];

  items.forEach((item, index) => {
    const base = index * 7;
    valuePlaceholders.push(
      `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5}, $${base + 6}, $${base + 7})`,
    );
    itemValues.push(
      orderId,
      item.productId,
      item.productName,
      item.productImageUrl,
      item.unitPrice,
      item.quantity,
      item.lineTotal,
    );
  });

  await client.query(
    `INSERT INTO order_items
       (order_id, product_id, product_name, product_image_url, unit_price, quantity, line_total)
     VALUES ${valuePlaceholders.join(", ")}`,
    itemValues,
  );

  return orderId;
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<boolean> {
  const result = await query(
    `UPDATE orders SET status = $2::order_status, updated_at = NOW() WHERE id = $1`,
    [id, status],
  );

  return (result.rowCount ?? 0) > 0;
}

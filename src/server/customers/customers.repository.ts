import type { QueryResultRow } from "pg";
import { query } from "@/server/db/pool";
import type { AdminCustomerSummary } from "@/types/customer.types";

type CustomerRow = QueryResultRow & {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  is_active: boolean;
  created_at: Date;
  last_login_at: Date | null;
  order_count: number;
  total_spent: string;
};

function toCustomerSummary(row: CustomerRow): AdminCustomerSummary {
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    name: `${row.first_name} ${row.last_name}`.trim(),
    email: row.email,
    isActive: row.is_active,
    orderCount: row.order_count,
    totalSpent: Number(row.total_spent),
    createdAt: row.created_at.toISOString(),
    lastLoginAt: row.last_login_at ? row.last_login_at.toISOString() : null,
  };
}

export type CustomerListFilters = {
  search?: string;
  // "active" | "inactive" | undefined (all)
  active?: boolean;
};

function buildWhere(filters: CustomerListFilters) {
  // Only customer accounts are listed (admins are managed via env config).
  const conditions: string[] = ["u.role = 'CUSTOMER'"];
  const values: unknown[] = [];

  if (filters.search) {
    values.push(`%${filters.search}%`);
    const placeholder = `$${values.length}`;
    conditions.push(`(u.email ILIKE ${placeholder} OR (u.first_name || ' ' || u.last_name) ILIKE ${placeholder})`);
  }

  if (filters.active !== undefined) {
    values.push(filters.active);
    conditions.push(`u.is_active = $${values.length}`);
  }

  return { clause: `WHERE ${conditions.join(" AND ")}`, values };
}

// Aggregates use correlated subqueries so a customer with no orders still
// appears (with zeroed totals). Cancelled orders are excluded from spend.
const CUSTOMER_SELECT = `
  SELECT u.id, u.first_name, u.last_name, u.email, u.is_active, u.created_at, u.last_login_at,
         COALESCE((SELECT COUNT(*) FROM orders o WHERE o.user_id = u.id AND o.status <> 'CANCELLED'), 0)::int AS order_count,
         COALESCE((SELECT SUM(o.total) FROM orders o WHERE o.user_id = u.id AND o.status <> 'CANCELLED'), 0) AS total_spent
  FROM users u
`;

export async function countCustomers(filters: CustomerListFilters) {
  const { clause, values } = buildWhere(filters);
  const result = await query<{ count: string }>(`SELECT COUNT(*)::int AS count FROM users u ${clause}`, values);
  return result.rows[0] ? Number(result.rows[0].count) : 0;
}

export async function listCustomers(
  filters: CustomerListFilters,
  limit: number,
  offset: number,
): Promise<AdminCustomerSummary[]> {
  const { clause, values } = buildWhere(filters);
  values.push(limit, offset);

  const result = await query<CustomerRow>(
    `${CUSTOMER_SELECT} ${clause}
     ORDER BY u.created_at DESC
     LIMIT $${values.length - 1} OFFSET $${values.length}`,
    values,
  );

  return result.rows.map(toCustomerSummary);
}

export async function findCustomerById(id: string): Promise<AdminCustomerSummary | null> {
  const result = await query<CustomerRow>(`${CUSTOMER_SELECT} WHERE u.role = 'CUSTOMER' AND u.id = $1 LIMIT 1`, [id]);
  return result.rows[0] ? toCustomerSummary(result.rows[0]) : null;
}

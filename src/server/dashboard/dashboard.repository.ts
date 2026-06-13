import { query } from "@/server/db/pool";
import type { DashboardStats } from "@/types/dashboard.types";

// Aggregate the headline KPIs in a few cheap COUNT/SUM queries run in parallel.
export async function getDashboardStats(): Promise<DashboardStats> {
  const [orders, customers, products] = await Promise.all([
    // Revenue and order count exclude cancelled orders.
    query<{ revenue: string; order_count: string }>(
      `SELECT COALESCE(SUM(total), 0) AS revenue, COUNT(*)::int AS order_count
       FROM orders WHERE status <> 'CANCELLED'`,
    ),
    query<{ customer_count: string }>(`SELECT COUNT(*)::int AS customer_count FROM users WHERE role = 'CUSTOMER'`),
    query<{ total: string; active: string }>(
      `SELECT COUNT(*)::int AS total, COUNT(*) FILTER (WHERE status = 'ACTIVE')::int AS active FROM products`,
    ),
  ]);

  return {
    revenue: Number(orders.rows[0]?.revenue ?? 0),
    orderCount: Number(orders.rows[0]?.order_count ?? 0),
    customerCount: Number(customers.rows[0]?.customer_count ?? 0),
    productTotal: Number(products.rows[0]?.total ?? 0),
    productActive: Number(products.rows[0]?.active ?? 0),
  };
}

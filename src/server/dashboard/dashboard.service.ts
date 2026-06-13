import { listPublicProducts } from "@/server/catalog/catalog.repository";
import { getDashboardStats } from "@/server/dashboard/dashboard.repository";
import { listOrders } from "@/server/orders/orders.repository";
import type { DashboardData } from "@/types/dashboard.types";

// Assemble the admin dashboard: headline stats, the latest orders, and the most
// popular active products. All three are fetched in parallel.
export async function getDashboardService(): Promise<DashboardData> {
  const [stats, recentOrders, popularProducts] = await Promise.all([
    getDashboardStats(),
    listOrders({}, 5, 0),
    listPublicProducts({ statuses: ["ACTIVE"] }, "popular", 5, 0),
  ]);

  return { stats, recentOrders, popularProducts };
}

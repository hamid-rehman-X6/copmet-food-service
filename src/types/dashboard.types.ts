import type { PublicProduct } from "@/types/catalog.types";
import type { OrderSummary } from "@/types/order.types";

export type DashboardStats = {
  revenue: number;
  orderCount: number;
  customerCount: number;
  productTotal: number;
  productActive: number;
};

export type DashboardData = {
  stats: DashboardStats;
  recentOrders: OrderSummary[];
  popularProducts: PublicProduct[];
};

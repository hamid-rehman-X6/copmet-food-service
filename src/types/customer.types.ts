import type { OrderSummary } from "@/types/order.types";

// Customer as seen by the admin panel. Spend/order aggregates are computed from
// the orders table (excluding cancelled orders).
export type AdminCustomerSummary = {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  isActive: boolean;
  orderCount: number;
  totalSpent: number;
  createdAt: string;
  lastLoginAt: string | null;
};

// Full customer view: profile aggregates plus their recent orders.
export type AdminCustomerDetail = AdminCustomerSummary & {
  recentOrders: OrderSummary[];
};

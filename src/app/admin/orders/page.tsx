import type { Metadata } from "next";
import { AdminOrders } from "@/components/admin/orders/AdminOrders";

export const metadata: Metadata = {
  title: "Orders",
};

// Order management is interactive (filter, paginate, view detail, update
// status), so the page delegates to the client-side AdminOrders component.
export default function AdminOrdersPage() {
  return <AdminOrders />;
}

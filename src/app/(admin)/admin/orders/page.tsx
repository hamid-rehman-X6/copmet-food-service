// Admin order logs page for WhatsApp order tracking.
import { DataTable } from "@/components/admin/DataTable";
import { orderRepository } from "@/lib/repositories/mock";
import type { OrderLog } from "@/types/order";

export default async function AdminOrdersPage() {
  const orders = await orderRepository.getOrders();

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Orders</h2>
      <DataTable<OrderLog>
        columns={[
          { key: "productName", header: "Product", render: (row) => row.productName },
          { key: "variant", header: "Variant", render: (row) => row.variant },
          { key: "quantity", header: "Quantity", render: (row) => row.quantity },
          { key: "createdAt", header: "Created", render: (row) => new Date(row.createdAt).toLocaleString() },
        ]}
        rows={orders}
      />
    </section>
  );
}

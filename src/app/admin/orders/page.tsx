import type { Metadata } from "next";
import { adminOrders, orderMetrics } from "@/constants/admin.constants";
import { formatCurrency } from "@/lib/formatters";
import { AdminMetricGrid } from "@/components/admin/AdminMetricGrid";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { AdminTableShell } from "@/components/admin/AdminTableShell";
import { Icon } from "@/components/common/Icon";

export const metadata: Metadata = {
  title: "Orders",
};

export default function AdminOrdersPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        actionIcon="receipt"
        actionLabel="Export Orders"
        description="Track batch packing, cold delivery progress, and freezer order value."
        eyebrow="Frozen Operations"
        title="Freezer Orders"
      />

      <AdminMetricGrid metrics={orderMetrics} />

      <AdminTableShell summary="Showing 1 to 5 of 286 freezer orders">
        <table className="w-full min-w-[860px] text-left">
          <thead className="bg-surface-low text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
            <tr>
              <th className="px-6 py-5">Order</th>
              <th className="px-6 py-5">Customer</th>
              <th className="px-6 py-5">Frozen Items</th>
              <th className="px-6 py-5">Total</th>
              <th className="px-6 py-5">Status</th>
              <th className="px-6 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {adminOrders.map((order) => (
              <tr className="transition-colors hover:bg-surface-low/70" key={order.id}>
                <td className="px-6 py-5">
                  <h2 className="text-sm font-bold">{order.id}</h2>
                  <p className="mt-1 text-xs text-muted-foreground">{order.placed}</p>
                </td>
                <td className="px-6 py-5 text-sm">{order.customer}</td>
                <td className="px-6 py-5 text-sm font-semibold">{order.items}</td>
                <td className="px-6 py-5 text-sm font-bold text-primary">{formatCurrency(order.total)}</td>
                <td className="px-6 py-5"><AdminStatusBadge status={order.status} /></td>
                <td className="px-6 py-5 text-right">
                  <button aria-label={`Actions for ${order.id}`} className="grid h-10 w-10 place-items-center rounded-lg text-muted-foreground hover:bg-surface-highest hover:text-primary" type="button">
                    <Icon className="h-5 w-5" name="moreHorizontal" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </AdminTableShell>
    </div>
  );
}

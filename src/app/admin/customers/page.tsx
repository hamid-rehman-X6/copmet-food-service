import type { Metadata } from "next";
import { adminCustomers, customerMetrics } from "@/constants/admin.constants";
import { formatCurrency } from "@/lib/formatters";
import { AdminMetricGrid } from "@/components/admin/AdminMetricGrid";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { AdminTableShell } from "@/components/admin/AdminTableShell";
import { Icon } from "@/components/common/Icon";

export const metadata: Metadata = {
  title: "Customers",
};

export default function AdminCustomersPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        actionIcon="plus"
        actionLabel="Add Customer"
        description="Review freezer order activity, account status, delivery preferences, and lifetime value."
        eyebrow="Household Relationships"
        title="Customers"
      />

      <AdminMetricGrid metrics={customerMetrics} />

      <AdminTableShell summary="Showing 1 to 5 of 1,248 customers">
        <table className="w-full min-w-[920px] text-left">
          <thead className="bg-surface-low text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
            <tr>
              <th className="px-6 py-5">Customer</th>
              <th className="px-6 py-5">Orders</th>
              <th className="px-6 py-5">Total Spent</th>
              <th className="px-6 py-5">Joined</th>
              <th className="px-6 py-5">Status</th>
              <th className="px-6 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {adminCustomers.map((customer) => (
              <tr className="transition-colors hover:bg-surface-low/70" key={customer.id}>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <span className="grid h-11 w-11 place-items-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                      {customer.name.split(" ").map((part) => part[0]).join("")}
                    </span>
                    <div>
                      <h2 className="text-sm font-bold">{customer.name}</h2>
                      <p className="mt-1 text-xs text-muted-foreground">{customer.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 text-sm font-semibold">{customer.orders}</td>
                <td className="px-6 py-5 text-sm font-bold text-primary">{formatCurrency(customer.totalSpent)}</td>
                <td className="px-6 py-5 text-sm text-muted-foreground">{customer.joined}</td>
                <td className="px-6 py-5"><AdminStatusBadge status={customer.status} /></td>
                <td className="px-6 py-5 text-right">
                  <button aria-label={`Actions for ${customer.name}`} className="grid h-10 w-10 place-items-center rounded-lg text-muted-foreground hover:bg-surface-highest hover:text-primary" type="button">
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

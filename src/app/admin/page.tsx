import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { adminDishes, adminOrders, dashboardMetrics } from "@/constants/admin.constants";
import { formatCurrency } from "@/lib/formatters";
import { AdminMetricGrid } from "@/components/admin/AdminMetricGrid";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { AdminTableShell } from "@/components/admin/AdminTableShell";
import { Icon } from "@/components/common/Icon";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        description="Monitor today's freezer orders, batch activity, cold delivery flow, and customer demand."
        eyebrow="Management Overview"
        title="Dashboard"
      />

      <AdminMetricGrid metrics={dashboardMetrics} />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(20rem,0.75fr)]">
        <div>
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="heading-font text-2xl font-semibold">Recent Freezer Orders</h2>
            <Link className="text-sm font-semibold text-primary hover:underline" href="/admin/orders">View all</Link>
          </div>
          <AdminTableShell summary="Showing 5 recent frozen orders">
            <table className="w-full min-w-[720px] text-left">
              <thead className="bg-surface-low text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                <tr>
                  <th className="px-6 py-4">Order</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {adminOrders.map((order) => (
                  <tr className="transition-colors hover:bg-surface-low/70" key={order.id}>
                    <td className="px-6 py-5">
                      <p className="text-sm font-bold">{order.id}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{order.placed}</p>
                    </td>
                    <td className="px-6 py-5 text-sm">{order.customer}</td>
                    <td className="px-6 py-5 text-sm font-semibold text-primary">{formatCurrency(order.total)}</td>
                    <td className="px-6 py-5"><AdminStatusBadge status={order.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </AdminTableShell>
        </div>

        <section className="rounded-2xl border border-border/60 bg-card p-5 shadow-[var(--shadow-soft)] sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-secondary">Demand</p>
              <h2 className="heading-font mt-1 text-2xl font-semibold">Popular Freezer Items</h2>
            </div>
            <Link aria-label="Manage frozen catalog" className="grid h-10 w-10 place-items-center rounded-lg text-primary hover:bg-surface-low" href="/admin/menu">
              <Icon className="h-5 w-5" name="arrowRight" />
            </Link>
          </div>
          <div className="mt-6 space-y-5">
            {adminDishes.slice(0, 4).map((dish, index) => (
              <article className="flex items-center gap-4" key={dish.id}>
                <span className="heading-font w-5 text-sm font-bold text-muted-foreground">0{index + 1}</span>
                <Image alt={dish.image.alt} className="h-14 w-14 rounded-xl object-cover" height={56} src={dish.image.src} width={56} />
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-semibold">{dish.name}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{dish.category}</p>
                </div>
                <span className="text-sm font-bold text-primary">{formatCurrency(dish.price)}</span>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

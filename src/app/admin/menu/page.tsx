import type { Metadata } from "next";
import Image from "next/image";
import { adminDishes, menuMetrics } from "@/constants/admin.constants";
import { formatCurrency } from "@/lib/formatters";
import { AdminMetricCard } from "@/components/admin/AdminMetricCard";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { AdminTableShell } from "@/components/admin/AdminTableShell";
import { Icon } from "@/components/common/Icon";

export const metadata: Metadata = {
  title: "Frozen Catalog",
};

export default function AdminMenuPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        actionLabel="Add Frozen Item"
        description="Curate freezer-ready meals, batch availability, pricing, and stock status."
        eyebrow="Frozen Catalog"
        title="Frozen Catalog"
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {menuMetrics.map((metric) => (
          <AdminMetricCard key={metric.label} metric={metric} />
        ))}
        <article className="rounded-2xl border border-border/60 bg-card p-5 shadow-[var(--shadow-soft)] sm:col-span-2 sm:p-6 xl:col-span-1">
          <p className="text-sm font-medium text-muted-foreground">Popular Freezer Categories</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-full bg-secondary-container/60 px-3 py-1.5 text-xs font-semibold text-secondary-container-foreground">Family Packs</span>
            <span className="rounded-full bg-success-soft px-3 py-1.5 text-xs font-semibold text-success-soft-foreground">Mains</span>
            <span className="rounded-full bg-surface-highest px-3 py-1.5 text-xs font-semibold text-muted-foreground">+3 More</span>
          </div>
        </article>
      </div>

      <AdminTableShell summary="Showing 1 to 5 of 48 frozen items">
        <table className="w-full min-w-[900px] text-left">
          <thead className="bg-surface-low text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
            <tr>
              <th className="px-6 py-5">Frozen Item</th>
              <th className="px-6 py-5">Category</th>
              <th className="px-6 py-5">Price</th>
              <th className="px-6 py-5">Status</th>
              <th className="px-6 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {adminDishes.map((dish) => (
              <tr className="transition-colors hover:bg-surface-low/70" key={dish.id}>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <Image alt={dish.image.alt} className="h-14 w-14 rounded-xl object-cover" height={56} src={dish.image.src} width={56} />
                    <div>
                      <h2 className="text-sm font-bold">{dish.name}</h2>
                      <p className="mt-1 text-xs text-muted-foreground">{dish.detail}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 text-sm">{dish.category}</td>
                <td className="px-6 py-5 text-sm font-bold text-primary">{formatCurrency(dish.price)}</td>
                <td className="px-6 py-5"><AdminStatusBadge status={dish.status} /></td>
                <td className="px-6 py-5 text-right">
                  <button aria-label={`Actions for ${dish.name}`} className="grid h-10 w-10 place-items-center rounded-lg text-muted-foreground hover:bg-surface-highest hover:text-primary" type="button">
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

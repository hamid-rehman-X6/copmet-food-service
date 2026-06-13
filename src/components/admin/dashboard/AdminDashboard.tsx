"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { apiRequest, ApiClientError } from "@/lib/api-client";
import { formatDateTime } from "@/lib/formatters";
import { orderStatusLabels, orderStatusTones } from "@/constants/order.constants";
import { useCurrency } from "@/components/providers/CurrencyProvider";
import { AdminMetricGrid } from "@/components/admin/AdminMetricGrid";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { AdminTableShell } from "@/components/admin/AdminTableShell";
import { Icon } from "@/components/common/Icon";
import type { AdminMetric } from "@/types/admin.types";
import type { DashboardData } from "@/types/dashboard.types";

export function AdminDashboard() {
  const { format } = useCurrency();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    apiRequest<DashboardData>("/api/v1/admin/dashboard")
      .then((response) => {
        if (active) setData(response.data);
      })
      .catch((requestError) => {
        if (active) setError(requestError instanceof ApiClientError ? requestError.message : "Unable to load the dashboard.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  // Translate raw stats into the metric cards' display shape.
  const metrics: AdminMetric[] = data
    ? [
        { label: "Revenue", value: format(data.stats.revenue), detail: "Excludes cancelled orders", icon: "wallet", tone: "primary" },
        { label: "Orders", value: String(data.stats.orderCount), detail: "Total placed", icon: "receipt", tone: "warning" },
        { label: "Customers", value: String(data.stats.customerCount), detail: "Registered accounts", icon: "users", tone: "success" },
        {
          label: "Frozen Items",
          value: String(data.stats.productTotal),
          detail: `${data.stats.productActive} active`,
          icon: "utensils",
          tone: "neutral",
        },
      ]
    : [];

  return (
    <div className="space-y-8">
      <AdminPageHeader
        description="Monitor freezer orders, revenue, cold delivery flow, and customer demand."
        eyebrow="Management Overview"
        title="Dashboard"
      />

      {error ? (
        <div className="rounded-xl border border-error/30 bg-error/5 px-5 py-4 text-sm text-error">{error}</div>
      ) : null}

      {loading ? (
        <p className="rounded-2xl border border-dashed border-border bg-surface-low px-6 py-16 text-center text-sm text-muted-foreground">
          Loading dashboard...
        </p>
      ) : data ? (
        <>
          <AdminMetricGrid metrics={metrics} />

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(20rem,0.75fr)]">
            <div>
              <div className="mb-4 flex items-center justify-between gap-4">
                <h2 className="heading-font text-2xl font-semibold">Recent Freezer Orders</h2>
                <Link className="text-sm font-semibold text-primary hover:underline" href="/admin/orders">
                  View all
                </Link>
              </div>
              <AdminTableShell summary={`${data.recentOrders.length} most recent orders`}>
                <table className="w-full min-w-[640px] text-left">
                  <thead className="bg-surface-low text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                    <tr>
                      <th className="px-6 py-4">Order</th>
                      <th className="px-6 py-4">Customer</th>
                      <th className="px-6 py-4">Total</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {data.recentOrders.length === 0 ? (
                      <tr>
                        <td className="px-6 py-10 text-center text-sm text-muted-foreground" colSpan={4}>
                          No orders yet.
                        </td>
                      </tr>
                    ) : (
                      data.recentOrders.map((order) => (
                        <tr className="transition-colors hover:bg-surface-low/70" key={order.id}>
                          <td className="px-6 py-5">
                            <p className="text-sm font-bold">{order.reference}</p>
                            <p className="mt-1 text-xs text-muted-foreground">{formatDateTime(order.placedAt)}</p>
                          </td>
                          <td className="px-6 py-5 text-sm">{order.customer.name}</td>
                          <td className="px-6 py-5 text-sm font-semibold text-primary">{format(order.total)}</td>
                          <td className="px-6 py-5">
                            <AdminStatusBadge status={orderStatusLabels[order.status]} tone={orderStatusTones[order.status]} />
                          </td>
                        </tr>
                      ))
                    )}
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
                {data.popularProducts.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No products yet.</p>
                ) : (
                  data.popularProducts.map((product, index) => (
                    <article className="flex items-center gap-4" key={product.id}>
                      <span className="heading-font w-5 text-sm font-bold text-muted-foreground">0{index + 1}</span>
                      {product.image.src ? (
                        <Image alt={product.image.alt} className="h-14 w-14 rounded-xl object-cover" height={56} src={product.image.src} width={56} />
                      ) : (
                        <span className="grid h-14 w-14 place-items-center rounded-xl bg-surface-highest text-muted-foreground">
                          <Icon className="h-5 w-5" name="utensils" />
                        </span>
                      )}
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-sm font-semibold">{product.name}</h3>
                        <p className="mt-1 text-xs text-muted-foreground">{product.category}</p>
                      </div>
                      <span className="text-sm font-bold text-primary">{format(product.price)}</span>
                    </article>
                  ))
                )}
              </div>
            </section>
          </div>
        </>
      ) : null}
    </div>
  );
}

import { AdminMetricGridSkeleton } from "@/components/admin/AdminMetricGridSkeleton";
import { AdminTableShell } from "@/components/admin/AdminTableShell";
import { AdminTableSkeleton } from "@/components/admin/AdminTableSkeleton";
import { Skeleton } from "@/components/common/Skeleton";

// Full-page placeholder for the admin dashboard: metric cards, the recent
// orders table, and the popular items panel — laid out exactly like the real
// content so nothing shifts once data arrives.
export function AdminDashboardSkeleton() {
  return (
    <>
      <AdminMetricGridSkeleton />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(20rem,0.75fr)]">
        <div>
          <div className="mb-4 flex items-center justify-between gap-4">
            <Skeleton className="h-7 w-56" />
            <Skeleton className="h-4 w-14" />
          </div>
          <AdminTableShell summary={<Skeleton className="h-4 w-40" />}>
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
                <AdminTableSkeleton columns={["stack", "text", "text", "badge"]} rows={5} />
              </tbody>
            </table>
          </AdminTableShell>
        </div>

        <section className="rounded-2xl border border-border/60 bg-card p-5 shadow-[var(--shadow-soft)] sm:p-6">
          <div className="space-y-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-7 w-44" />
          </div>
          <div className="mt-6 space-y-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <div className="flex items-center gap-4" key={index}>
                <Skeleton className="h-4 w-5" />
                <Skeleton className="h-14 w-14 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3.5 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-4 w-12" />
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

import { Skeleton } from "@/components/common/Skeleton";

// Placeholder for the dashboard metric cards, mirroring AdminMetricCard's layout
// (label + value on the left, icon tile on the right) to avoid layout shift.
export function AdminMetricGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <article className="rounded-2xl border border-border/60 bg-card p-5 shadow-[var(--shadow-soft)] sm:p-6" key={index}>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-3">
              <Skeleton className="h-3.5 w-20" />
              <Skeleton className="h-8 w-24" />
            </div>
            <Skeleton className="h-11 w-11 rounded-xl" />
          </div>
          <Skeleton className="mt-5 h-3 w-28" />
        </article>
      ))}
    </div>
  );
}

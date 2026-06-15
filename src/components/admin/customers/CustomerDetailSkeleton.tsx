import { Skeleton } from "@/components/common/Skeleton";

// Placeholder for the customer detail modal body: status line, the three stat
// cards, and the recent orders list.
export function CustomerDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-3.5 w-32" />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div className="space-y-3 rounded-xl border border-border/60 p-4" key={index}>
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-6 w-20" />
          </div>
        ))}
      </div>

      <div>
        <Skeleton className="mb-3 h-3 w-28" />
        <div className="divide-y divide-border/60 overflow-hidden rounded-xl border border-border/60">
          {Array.from({ length: 3 }).map((_, index) => (
            <div className="flex items-center justify-between gap-4 px-4 py-3" key={index}>
              <div className="space-y-2">
                <Skeleton className="h-3.5 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { Skeleton } from "@/components/common/Skeleton";

// Placeholder for the order detail modal body: status control bar, the customer
// and delivery cards, the item list, and the totals block.
export function OrderDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 rounded-xl border border-border bg-surface-low p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-3.5 w-14" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-40 rounded-lg" />
          <Skeleton className="h-9 w-20 rounded-full" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <div className="space-y-2 rounded-xl border border-border/60 p-4" key={index}>
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3.5 w-36" />
            <Skeleton className="h-3.5 w-28" />
          </div>
        ))}
      </div>

      <div>
        <Skeleton className="mb-3 h-3 w-16" />
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div className="flex items-center gap-3" key={index}>
              <Skeleton className="h-12 w-12 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3.5 w-40" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-4 w-14" />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3 border-t border-border pt-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div className="flex items-center justify-between" key={index}>
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="h-3.5 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}

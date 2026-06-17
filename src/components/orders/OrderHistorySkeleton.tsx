import { Skeleton } from "@/components/common/Skeleton";

// Placeholder for the customer order history list, mirroring the order cards so
// there is no layout shift once the orders load.
export function OrderHistorySkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <article className="rounded-2xl border border-border/60 bg-card p-5 shadow-[var(--shadow-soft)]" key={index}>
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
          <div className="mt-4 flex items-center justify-between gap-3 border-t border-border/60 pt-4">
            <Skeleton className="h-3.5 w-20" />
            <Skeleton className="h-5 w-16" />
          </div>
        </article>
      ))}
    </div>
  );
}

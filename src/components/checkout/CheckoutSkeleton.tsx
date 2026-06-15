import { Skeleton } from "@/components/common/Skeleton";

// Placeholder for the checkout layout (order summary + delivery form) shown
// while the session resolves on this protected route.
export function CheckoutSkeleton() {
  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
      {/* Order summary */}
      <section className="lg:col-span-5">
        <div className="space-y-6 rounded-2xl border border-border/60 bg-card p-4 shadow-[var(--shadow-soft)] sm:p-6">
          <Skeleton className="h-7 w-48" />
          {Array.from({ length: 2 }).map((_, index) => (
            <div className="flex gap-4" key={index}>
              <Skeleton className="h-20 w-20 shrink-0 rounded-lg sm:h-24 sm:w-24" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-9 w-32 rounded-full" />
              </div>
            </div>
          ))}
          <div className="space-y-3 border-t border-border pt-6">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        </div>
      </section>

      {/* Delivery form */}
      <section className="space-y-6 lg:col-span-7">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-5 md:grid-cols-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton className="h-12 w-full rounded-lg" key={index} />
          ))}
        </div>
        <Skeleton className="h-14 w-full rounded-full" />
      </section>
    </div>
  );
}

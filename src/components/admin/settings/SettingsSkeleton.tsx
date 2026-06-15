import { Skeleton } from "@/components/common/Skeleton";

// Placeholder for the store settings form: currency field, the two delivery
// inputs, and the save action — matching the real card's layout.
export function SettingsSkeleton() {
  return (
    <div className="max-w-2xl space-y-6 rounded-2xl border border-border/60 bg-card p-5 shadow-[var(--shadow-soft)] sm:p-7">
      <div className="space-y-2">
        <Skeleton className="h-3.5 w-20" />
        <Skeleton className="h-10 w-full rounded-lg" />
        <Skeleton className="h-3 w-48" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <div className="space-y-2" key={index}>
            <Skeleton className="h-3.5 w-28" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        ))}
      </div>

      <div className="flex justify-end border-t border-border/60 pt-5">
        <Skeleton className="h-11 w-36 rounded-full" />
      </div>
    </div>
  );
}

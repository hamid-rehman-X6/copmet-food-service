import { Skeleton } from "@/components/common/Skeleton";

const cardClass = "rounded-2xl border border-border/60 bg-card p-5 shadow-[var(--shadow-soft)] sm:p-7";
const fieldClass = "space-y-1.5";

function FieldSkeleton() {
  return (
    <div className={fieldClass}>
      <Skeleton className="h-3.5 w-24" />
      <Skeleton className="h-10 w-full rounded-lg" />
    </div>
  );
}

// Placeholder for the profile page: avatar card, account details form, and
// password form — matching ProfilePanel's section layout.
export function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <section className={cardClass}>
        <Skeleton className="h-6 w-40" />
        <Skeleton className="mt-2 h-3.5 w-56" />
        <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          <Skeleton className="h-28 w-28 shrink-0 rounded-full" />
          <div className="flex flex-1 flex-wrap gap-3">
            <Skeleton className="h-9 w-36 rounded-full" />
            <Skeleton className="h-9 w-24 rounded-full" />
          </div>
        </div>
      </section>

      <section className={`${cardClass} space-y-5`}>
        <div className="space-y-2">
          <Skeleton className="h-6 w-44" />
          <Skeleton className="h-3.5 w-64" />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <FieldSkeleton />
          <FieldSkeleton />
        </div>
        <FieldSkeleton />
        <div className="flex justify-end">
          <Skeleton className="h-11 w-36 rounded-full" />
        </div>
      </section>

      <section className={`${cardClass} space-y-5`}>
        <div className="space-y-2">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-3.5 w-72" />
        </div>
        <FieldSkeleton />
        <div className="grid gap-5 sm:grid-cols-2">
          <FieldSkeleton />
          <FieldSkeleton />
        </div>
        <div className="flex justify-end">
          <Skeleton className="h-11 w-40 rounded-full" />
        </div>
      </section>
    </div>
  );
}

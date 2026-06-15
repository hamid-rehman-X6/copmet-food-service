import { Skeleton, SkeletonText } from "@/components/common/Skeleton";

// Placeholder mirroring MenuCard: image, title + price, description, tags, and
// the add-to-cart button. Render several in the menu grid while products load.
export function MenuCardSkeleton() {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl bg-card shadow-[var(--shadow-soft)]">
      <Skeleton className="h-56 w-full rounded-none sm:h-64" />
      <div className="flex flex-1 flex-col gap-4 p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-6 w-16" />
        </div>
        <SkeletonText lines={2} />
        <div className="mt-auto grid gap-3 pt-2">
          <div className="flex gap-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
          <Skeleton className="h-11 w-full rounded-full" />
        </div>
      </div>
    </article>
  );
}

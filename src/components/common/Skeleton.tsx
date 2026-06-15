import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

// Base skeleton primitive (shadcn-style): a pulsing placeholder block. Compose
// it with width/height utility classes to mirror the real content's layout
// while data loads. Decorative only, so it is hidden from assistive tech.
export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div aria-hidden className={cn("animate-pulse rounded-md bg-surface-highest", className)} {...props} />;
}

// A stack of skeleton lines, handy for paragraphs/multi-line text placeholders.
// The last line is shortened to look more natural.
export function SkeletonText({ lines = 2, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton className={cn("h-3.5", index === lines - 1 && lines > 1 ? "w-2/3" : "w-full")} key={index} />
      ))}
    </div>
  );
}

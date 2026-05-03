// Lightweight badge primitive for labels and statuses.
import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

type BadgeProps = HTMLAttributes<HTMLSpanElement>;

export function Badge({ className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border border-[var(--color-hairline)] px-2 py-1 text-[11px] font-semibold",
        className,
      )}
      {...props}
    />
  );
}

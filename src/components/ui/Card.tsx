// Shared card wrapper for consistent surface styling.
import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

type CardProps = HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-md)] border border-[var(--color-hairline)] bg-white p-4 shadow-[var(--shadow-soft)]",
        className,
      )}
      {...props}
    />
  );
}

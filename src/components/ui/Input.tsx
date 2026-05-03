// Reusable form input with shared styling.
import { cn } from "@/lib/utils";
import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "h-14 w-full rounded-[var(--radius-sm)] border border-[var(--color-hairline)] bg-white px-3 text-sm outline-none focus:border-[var(--color-ink)] focus:border-2",
        className,
      )}
      {...props}
    />
  );
}

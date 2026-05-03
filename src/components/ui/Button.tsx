// Reusable button component with design-system variants.
import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

export function Button({
  className,
  variant = "primary",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "h-12 rounded-[var(--radius-sm)] px-6 text-sm font-medium transition",
        variant === "primary" &&
          "bg-[var(--color-primary)] text-[var(--color-on-primary)] hover:bg-[var(--color-primary-active)]",
        variant === "secondary" &&
          "border border-[var(--color-hairline)] bg-white text-[var(--color-ink)]",
        className,
      )}
      type={type}
      {...props}
    />
  );
}

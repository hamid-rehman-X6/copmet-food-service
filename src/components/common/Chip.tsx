import { cn } from "@/lib/utils";
import type { BadgeTone } from "@/types/common.types";

const tones: Record<BadgeTone, string> = {
  primary: "bg-primary text-primary-foreground",
  secondary: "bg-secondary-container text-secondary-container-foreground",
  tertiary: "bg-success-soft text-success-soft-foreground",
  neutral: "bg-surface-highest text-muted-foreground",
};

export function Chip({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: BadgeTone;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex rounded-full px-3 py-1 text-xs font-semibold", tones[tone], className)}>
      {children}
    </span>
  );
}

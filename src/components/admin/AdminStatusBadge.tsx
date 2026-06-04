import { cn } from "@/lib/utils";
import type { AdminStatusTone } from "@/types/admin.types";

const statusToneMap: Record<string, AdminStatusTone> = {
  Active: "success",
  Delivered: "success",
  "On the Way": "success",
  Preparing: "warning",
  Draft: "warning",
  Inactive: "neutral",
  "Out of Stock": "danger",
  Cancelled: "danger",
};

const toneStyles: Record<AdminStatusTone, string> = {
  success: "bg-success-soft text-success-soft-foreground",
  warning: "bg-secondary-container/55 text-secondary-container-foreground",
  danger: "bg-error/10 text-error",
  neutral: "bg-surface-highest text-muted-foreground",
  primary: "bg-primary/10 text-primary",
};

export function AdminStatusBadge({ status, tone }: { status: string; tone?: AdminStatusTone }) {
  const resolvedTone = tone ?? statusToneMap[status] ?? "neutral";

  return (
    <span className={cn("inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold", toneStyles[resolvedTone])}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

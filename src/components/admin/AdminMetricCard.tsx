import { cn } from "@/lib/utils";
import { Icon } from "@/components/common/Icon";
import type { AdminMetric, AdminStatusTone } from "@/types/admin.types";

const iconTones: Record<AdminStatusTone, string> = {
  primary: "bg-primary/10 text-primary",
  success: "bg-success-soft text-tertiary",
  warning: "bg-secondary-container/45 text-secondary",
  danger: "bg-error/10 text-error",
  neutral: "bg-surface-highest text-muted-foreground",
};

export function AdminMetricCard({ metric }: { metric: AdminMetric }) {
  return (
    <article className="rounded-2xl border border-border/60 bg-card p-5 shadow-[var(--shadow-soft)] sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{metric.label}</p>
          <p className="heading-font mt-2 text-3xl font-bold text-foreground">{metric.value}</p>
        </div>
        <span className={cn("grid h-11 w-11 shrink-0 place-items-center rounded-xl", iconTones[metric.tone])}>
          <Icon className="h-5 w-5" name={metric.icon} />
        </span>
      </div>
      {metric.change || metric.detail ? (
        <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
          {metric.change ? <span className="font-bold text-tertiary">{metric.change}</span> : null}
          {metric.detail ? <span className="text-muted-foreground">{metric.detail}</span> : null}
        </div>
      ) : null}
    </article>
  );
}

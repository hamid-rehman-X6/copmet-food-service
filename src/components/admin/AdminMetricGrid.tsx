import { AdminMetricCard } from "@/components/admin/AdminMetricCard";
import type { AdminMetric } from "@/types/admin.types";

export function AdminMetricGrid({ metrics }: { metrics: AdminMetric[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <AdminMetricCard key={metric.label} metric={metric} />
      ))}
    </div>
  );
}

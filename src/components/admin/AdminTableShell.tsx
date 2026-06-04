import type { ReactNode } from "react";
import { Icon } from "@/components/common/Icon";

type AdminTableShellProps = {
  children: ReactNode;
  summary: string;
};

export function AdminTableShell({ children, summary }: AdminTableShellProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-[var(--shadow-soft)]">
      <div className="overflow-x-auto">{children}</div>
      <div className="flex flex-col gap-4 border-t border-border/60 bg-surface-low px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="text-xs text-muted-foreground sm:text-sm">{summary}</p>
        <nav aria-label="Table pagination" className="flex items-center gap-1.5">
          <button aria-label="Previous page" className="grid h-10 w-10 place-items-center rounded-lg border border-border text-muted-foreground hover:bg-card" type="button">
            <Icon className="h-4 w-4 rotate-180" name="arrowRight" />
          </button>
          <button className="grid h-10 w-10 place-items-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground" type="button">1</button>
          <button className="grid h-10 w-10 place-items-center rounded-lg text-sm font-semibold hover:bg-card" type="button">2</button>
          <button className="grid h-10 w-10 place-items-center rounded-lg text-sm font-semibold hover:bg-card" type="button">3</button>
          <button aria-label="Next page" className="grid h-10 w-10 place-items-center rounded-lg border border-border text-muted-foreground hover:bg-card" type="button">
            <Icon className="h-4 w-4" name="arrowRight" />
          </button>
        </nav>
      </div>
    </section>
  );
}

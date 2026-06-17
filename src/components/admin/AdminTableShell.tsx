import type { ReactNode } from "react";

type AdminTableShellProps = {
  children: ReactNode;
  /** Short summary line shown on the left of the footer (e.g. result count). */
  summary?: ReactNode;
  /** Optional footer content, typically pagination controls. */
  footer?: ReactNode;
};

// Card wrapper for admin data tables. Provides the rounded surface, horizontal
// scroll for wide tables, and an optional footer row for summary + pagination.
export function AdminTableShell({ children, summary, footer }: AdminTableShellProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-[var(--shadow-soft)]">
      <div className="overflow-x-auto">{children}</div>
      {summary || footer ? (
        <div className="flex flex-col gap-4 border-t border-border/60 bg-surface-low px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          {summary ? <div className="text-xs text-muted-foreground sm:text-sm">{summary}</div> : <span />}
          {footer}
        </div>
      ) : null}
    </section>
  );
}

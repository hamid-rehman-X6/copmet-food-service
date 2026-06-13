"use client";

import { cn } from "@/lib/utils";
import { Icon } from "@/components/common/Icon";
import type { PageMeta } from "@/types/common.types";

type AdminPaginationProps = {
  meta: PageMeta;
  onPageChange: (page: number) => void;
};

// Build a compact list of page numbers around the current page (with the first
// and last always shown) so the control stays small on large datasets.
function getPageWindow(current: number, total: number): number[] {
  const pages = new Set<number>([1, total, current, current - 1, current + 1]);
  return [...pages].filter((page) => page >= 1 && page <= total).sort((a, b) => a - b);
}

export function AdminPagination({ meta, onPageChange }: AdminPaginationProps) {
  const pages = getPageWindow(meta.page, meta.totalPages);

  return (
    <nav aria-label="Table pagination" className="flex items-center gap-1.5">
      <button
        aria-label="Previous page"
        className="grid h-10 w-10 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-card disabled:cursor-not-allowed disabled:opacity-40"
        disabled={meta.page <= 1}
        onClick={() => onPageChange(meta.page - 1)}
        type="button"
      >
        <Icon className="h-4 w-4 rotate-180" name="arrowRight" />
      </button>

      {pages.map((page, index) => {
        const previous = pages[index - 1];
        const showGap = previous !== undefined && page - previous > 1;

        return (
          <span className="flex items-center gap-1.5" key={page}>
            {showGap ? <span className="px-1 text-sm text-muted-foreground">…</span> : null}
            <button
              aria-current={page === meta.page ? "page" : undefined}
              className={cn(
                "grid h-10 w-10 place-items-center rounded-lg text-sm font-semibold transition-colors",
                page === meta.page ? "bg-primary text-primary-foreground" : "hover:bg-card",
              )}
              onClick={() => onPageChange(page)}
              type="button"
            >
              {page}
            </button>
          </span>
        );
      })}

      <button
        aria-label="Next page"
        className="grid h-10 w-10 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-card disabled:cursor-not-allowed disabled:opacity-40"
        disabled={meta.page >= meta.totalPages}
        onClick={() => onPageChange(meta.page + 1)}
        type="button"
      >
        <Icon className="h-4 w-4" name="arrowRight" />
      </button>
    </nav>
  );
}

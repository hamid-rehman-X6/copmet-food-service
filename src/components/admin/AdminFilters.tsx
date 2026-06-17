"use client";

import { cn } from "@/lib/utils";
import { Icon } from "@/components/common/Icon";
import { Select } from "@/components/common/Select";

// Shared filter controls reused across admin list pages (catalog, customers,
// orders) so search inputs and dropdown filters look and behave consistently.

export function AdminFilterBar({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center", className)}>{children}</div>
  );
}

export function AdminSearchField({
  value,
  onChange,
  placeholder = "Search...",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="relative w-full sm:max-w-xs sm:flex-1">
      <span className="sr-only">{placeholder}</span>
      <Icon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" name="search" />
      <input
        className="w-full rounded-xl border border-border bg-card py-2.5 pl-12 pr-4 text-sm outline-none transition-colors focus:border-primary"
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        type="search"
        value={value}
      />
    </label>
  );
}

// Uses the app's themed Select (same as the menu sort control) so the dropdown
// matches the design in both light and dark themes.
export function AdminSelectFilter({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
}) {
  return <Select className="w-full sm:w-auto sm:min-w-44" label={label} onChange={onChange} options={options} value={value} />;
}

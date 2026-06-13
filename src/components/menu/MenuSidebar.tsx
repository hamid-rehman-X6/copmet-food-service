"use client";

import { dietaryFilters } from "@/constants/menu.constants";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/components/providers/CurrencyProvider";
import { Icon } from "@/components/common/Icon";

// A category option uses an empty slug to represent "All Dishes".
export type CategoryOption = { label: string; slug: string };

type MenuSidebarProps = {
  search: string;
  categories: CategoryOption[];
  category: string;
  selectedDietary: string[];
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onDietaryToggle: (value: string) => void;
  onClearFilters: () => void;
};

export function MenuSidebar({
  search,
  categories,
  category,
  selectedDietary,
  onSearchChange,
  onCategoryChange,
  onDietaryToggle,
  onClearFilters,
}: MenuSidebarProps) {
  const { settings, format } = useCurrency();
  const hasFilters = search.length > 0 || category !== "" || selectedDietary.length > 0;

  return (
    <aside className="space-y-8 rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-soft)] sm:p-6 lg:w-64 lg:shrink-0 lg:space-y-12 lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none">
      <div>
        <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-foreground">Search</h2>
        <label className="relative block">
          <span className="sr-only">Search menu</span>
          <input
            className="w-full rounded-xl border border-transparent bg-surface-low px-5 py-4 pr-12 outline-none focus:border-primary"
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Freezer meals..."
            type="search"
            value={search}
          />
          <Icon className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-border-strong" name="search" />
        </label>
      </div>

      <div>
        <h2 className="mb-5 text-xs font-bold uppercase tracking-[0.22em] text-foreground">Categories</h2>
        <div className="flex flex-wrap gap-2 lg:flex-col lg:gap-4">
          {categories.map((option) => (
            <button
              aria-pressed={category === option.slug}
              className={cn(
                "flex items-center gap-2 rounded-full bg-surface-low px-3 py-2 text-left text-sm transition-colors hover:text-primary lg:gap-4 lg:bg-transparent lg:px-0 lg:py-0",
                category === option.slug && "bg-primary/10 font-semibold text-primary lg:bg-transparent",
              )}
              key={option.slug || "all"}
              onClick={() => onCategoryChange(option.slug)}
              type="button"
            >
              <span
                className={cn(
                  "grid h-5 w-5 place-items-center rounded-full border border-border",
                  category === option.slug && "border-primary",
                )}
              >
                {category === option.slug ? <span className="h-2.5 w-2.5 rounded-full bg-primary" /> : null}
              </span>
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-5 text-xs font-bold uppercase tracking-[0.22em] text-foreground">Dietary</h2>
        <div className="flex flex-wrap gap-3">
          {dietaryFilters.map((filter) => (
            <button
              aria-pressed={selectedDietary.includes(filter)}
              className={cn(
                "rounded-full bg-surface-highest px-3 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:bg-secondary-container hover:text-secondary-container-foreground",
                selectedDietary.includes(filter) && "bg-secondary-container text-secondary-container-foreground",
              )}
              key={filter}
              onClick={() => onDietaryToggle(filter)}
              type="button"
            >
              {filter}
            </button>
          ))}
        </div>
        {hasFilters ? (
          <button className="mt-5 text-xs font-semibold text-primary hover:underline" onClick={onClearFilters} type="button">
            Clear all filters
          </button>
        ) : null}
      </div>

      <div className="hidden rounded-xl bg-tertiary-container p-6 text-tertiary-container-foreground lg:block">
        <h2 className="heading-font mb-3 text-2xl font-semibold">Free Frozen Delivery</h2>
        <p className="mb-5 text-sm leading-6">
          On your first freezer stock-up order over {format(settings.freeDeliveryThreshold)}.
        </p>
        <button className="w-full rounded-lg bg-card px-4 py-3 text-sm font-semibold text-tertiary transition-colors hover:bg-surface-low">
          Stock Up
        </button>
      </div>
    </aside>
  );
}

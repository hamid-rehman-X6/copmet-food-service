import { dietaryFilters, menuCategories } from "@/constants/menu.constants";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/common/Icon";
import type { DietaryFilter, MenuCategory } from "@/types/menu.types";

type MenuSidebarProps = {
  search: string;
  category: MenuCategory;
  selectedDietary: DietaryFilter[];
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: MenuCategory) => void;
  onDietaryToggle: (value: DietaryFilter) => void;
  onClearFilters: () => void;
};

export function MenuSidebar({
  search,
  category,
  selectedDietary,
  onSearchChange,
  onCategoryChange,
  onDietaryToggle,
  onClearFilters,
}: MenuSidebarProps) {
  const hasFilters = search.length > 0 || category !== "All Dishes" || selectedDietary.length > 0;

  return (
    <aside className="space-y-12 lg:w-64 lg:shrink-0">
      <div>
        <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-foreground">Search</h2>
        <label className="relative block">
          <span className="sr-only">Search menu</span>
          <input
            className="w-full rounded-xl border border-transparent bg-surface-low px-5 py-4 pr-12 outline-none focus:border-primary"
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Cravings..."
            type="search"
            value={search}
          />
          <Icon className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-border-strong" name="search" />
        </label>
      </div>

      <div>
        <h2 className="mb-5 text-xs font-bold uppercase tracking-[0.22em] text-foreground">Categories</h2>
        <div className="flex flex-col gap-4">
          {menuCategories.map((option) => (
            <button
              aria-pressed={category === option}
              className={cn(
                "flex items-center gap-4 text-left text-sm transition-colors hover:text-primary",
                category === option && "font-semibold text-primary",
              )}
              key={option}
              onClick={() => onCategoryChange(option)}
              type="button"
            >
              <span
                className={cn(
                  "grid h-5 w-5 place-items-center rounded-full border border-border",
                  category === option && "border-primary",
                )}
              >
                {category === option ? <span className="h-2.5 w-2.5 rounded-full bg-primary" /> : null}
              </span>
              {option}
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

      <div className="rounded-xl bg-tertiary-container p-6 text-tertiary-container-foreground">
        <h2 className="heading-font mb-3 text-2xl font-semibold">Free Delivery</h2>
        <p className="mb-5 text-sm leading-6">On your first Copmet Food Service order over $45.</p>
        <button className="w-full rounded-lg bg-card px-4 py-3 text-sm font-semibold text-tertiary transition-colors hover:bg-surface-low">
          Claim Now
        </button>
      </div>
    </aside>
  );
}

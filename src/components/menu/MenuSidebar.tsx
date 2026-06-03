import { dietaryFilters, menuCategories } from "@/constants/menu.constants";
import { Chip } from "@/components/common/Chip";
import { Icon } from "@/components/common/Icon";

export function MenuSidebar() {
  return (
    <aside className="space-y-12 lg:w-64 lg:shrink-0">
      <div>
        <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-foreground">Search</h2>
        <label className="relative block">
          <span className="sr-only">Search menu</span>
          <input
            className="w-full rounded-xl border border-transparent bg-surface-low px-5 py-4 pr-12 outline-none focus:border-primary"
            placeholder="Cravings..."
            type="search"
          />
          <Icon className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-border-strong" name="search" />
        </label>
      </div>

      <div>
        <h2 className="mb-5 text-xs font-bold uppercase tracking-[0.22em] text-foreground">Categories</h2>
        <div className="flex flex-col gap-4">
          {menuCategories.map((category, index) => (
            <label className="flex cursor-pointer items-center gap-4 text-sm" key={category}>
              <input
                className="h-5 w-5 accent-primary"
                defaultChecked={index === 0}
                readOnly
                type="checkbox"
              />
              {category}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-5 text-xs font-bold uppercase tracking-[0.22em] text-foreground">Dietary</h2>
        <div className="flex flex-wrap gap-3">
          {dietaryFilters.map((filter, index) => (
            <Chip key={filter} tone={index === 0 ? "secondary" : "neutral"}>
              {filter}
            </Chip>
          ))}
        </div>
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

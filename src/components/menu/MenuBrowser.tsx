"use client";

import { useMemo, useState } from "react";
import { menuItems, menuSortOptions } from "@/constants/menu.constants";
import { Button } from "@/components/common/Button";
import { Icon } from "@/components/common/Icon";
import { Select } from "@/components/common/Select";
import { MenuCard } from "@/components/menu/MenuCard";
import { MenuSidebar } from "@/components/menu/MenuSidebar";
import type { DietaryFilter, MenuCategory, MenuSort } from "@/types/menu.types";

const PAGE_SIZE = 6;

export function MenuBrowser({ initialSearch = "" }: { initialSearch?: string }) {
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState<MenuCategory>("All Dishes");
  const [selectedDietary, setSelectedDietary] = useState<DietaryFilter[]>([]);
  const [sort, setSort] = useState<MenuSort>("popular");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const filteredItems = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    const matchingItems = menuItems.filter((item) => {
      const searchableText = [item.name, item.description, item.category, ...item.tags].join(" ").toLowerCase();
      const matchesSearch = normalizedSearch.length === 0 || searchableText.includes(normalizedSearch);
      const matchesCategory = category === "All Dishes" || item.category === category;
      const matchesDietary = selectedDietary.every((filter) => item.tags.includes(filter));

      return matchesSearch && matchesCategory && matchesDietary;
    });

    return matchingItems.toSorted((a, b) => {
      switch (sort) {
        case "newest":
          return b.createdAt.localeCompare(a.createdAt);
        case "rating":
          return b.rating - a.rating;
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        default:
          return b.popularity - a.popularity;
      }
    });
  }, [category, search, selectedDietary, sort]);

  const visibleItems = filteredItems.slice(0, visibleCount);
  const hasMoreItems = visibleCount < filteredItems.length;

  function resetVisibleCount() {
    setVisibleCount(PAGE_SIZE);
  }

  function toggleDietary(filter: DietaryFilter) {
    setSelectedDietary((current) =>
      current.includes(filter) ? current.filter((item) => item !== filter) : [...current, filter],
    );
    resetVisibleCount();
  }

  return (
    <div className="flex flex-col gap-10 lg:flex-row">
      <MenuSidebar
        category={category}
        onCategoryChange={(value) => {
          setCategory(value);
          resetVisibleCount();
        }}
        onClearFilters={() => {
          setSearch("");
          setCategory("All Dishes");
          setSelectedDietary([]);
          resetVisibleCount();
        }}
        onDietaryToggle={toggleDietary}
        onSearchChange={(value) => {
          setSearch(value);
          resetVisibleCount();
        }}
        search={search}
        selectedDietary={selectedDietary}
      />

      <section className="min-w-0 flex-1">
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h1 className="heading-font text-5xl font-bold tracking-tight text-foreground">Explore the Menu</h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Showing {visibleItems.length} of {filteredItems.length} handcrafted meals.
            </p>
          </div>
          <Select
            className="w-full md:w-64"
            label="Sort"
            onChange={(value) => {
              setSort(value as MenuSort);
              resetVisibleCount();
            }}
            options={menuSortOptions}
            value={sort}
          />
        </div>

        {visibleItems.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {visibleItems.map((item) => (
              <MenuCard item={item} key={item.id} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border bg-surface-low px-6 py-20 text-center">
            <h2 className="heading-font text-2xl font-semibold">No dishes found</h2>
            <p className="mt-2 text-sm text-muted-foreground">Try a different search or clear your filters.</p>
            <Button
              className="mt-6"
              onClick={() => {
                setSearch("");
                setCategory("All Dishes");
                setSelectedDietary([]);
                resetVisibleCount();
              }}
              variant="outline"
            >
              Clear Filters
            </Button>
          </div>
        )}

        {hasMoreItems ? (
          <div className="mt-16 flex justify-center">
            <Button
              className="border-2 border-border px-10 py-4"
              onClick={() => setVisibleCount((current) => current + PAGE_SIZE)}
              variant="outline"
            >
              Load More
              <Icon className="h-4 w-4" name="chevronDown" />
            </Button>
          </div>
        ) : null}
      </section>
    </div>
  );
}

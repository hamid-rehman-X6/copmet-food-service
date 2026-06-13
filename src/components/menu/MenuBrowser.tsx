"use client";

import { useEffect, useRef, useState } from "react";
import { apiRequest, ApiClientError } from "@/lib/api-client";
import { menuSortOptions } from "@/constants/menu.constants";
import { Button } from "@/components/common/Button";
import { Icon } from "@/components/common/Icon";
import { Select } from "@/components/common/Select";
import { MenuCard } from "@/components/menu/MenuCard";
import { MenuSidebar, type CategoryOption } from "@/components/menu/MenuSidebar";
import type { Category, PublicProduct } from "@/types/catalog.types";
import type { Paginated } from "@/types/common.types";
import type { MenuSort } from "@/types/menu.types";

const PAGE_SIZE = 9;

export function MenuBrowser({ initialSearch = "" }: { initialSearch?: string }) {
  const [items, setItems] = useState<PublicProduct[]>([]);
  const [meta, setMeta] = useState<Paginated<PublicProduct>["meta"] | null>(null);
  const [categories, setCategories] = useState<CategoryOption[]>([{ label: "All Dishes", slug: "" }]);

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filters. `searchInput` is the live value; `search` is debounced.
  const [searchInput, setSearchInput] = useState(initialSearch);
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState("");
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
  const [sort, setSort] = useState<MenuSort>("popular");
  const [page, setPage] = useState(1);

  // Drop stale responses (e.g. when filters change mid-request).
  const requestRef = useRef(0);
  const dietaryKey = selectedDietary.join(",");

  // Load categories once for the sidebar filter.
  useEffect(() => {
    apiRequest<{ categories: Category[] }>("/api/v1/categories")
      .then((response) =>
        setCategories([{ label: "All Dishes", slug: "" }, ...response.data.categories.map((item) => ({ label: item.name, slug: item.slug }))]),
      )
      .catch(() => undefined);
  }, []);

  // Debounce the search field.
  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(true);
      setSearch(searchInput.trim());
      setPage(1);
    }, 350);

    return () => clearTimeout(timeout);
  }, [searchInput]);

  // Fetch products on any filter/page change. Page 1 replaces the list; higher
  // pages append (the "Load More" pattern). setState runs only in callbacks.
  useEffect(() => {
    const requestId = (requestRef.current += 1);

    const params = new URLSearchParams({ page: String(page), pageSize: String(PAGE_SIZE), sort });
    if (search) params.set("search", search);
    if (category) params.set("category", category);
    if (dietaryKey) params.set("tags", dietaryKey);

    apiRequest<Paginated<PublicProduct>>(`/api/v1/products?${params.toString()}`)
      .then((response) => {
        if (requestId !== requestRef.current) return;
        setItems((current) => (page === 1 ? response.data.items : [...current, ...response.data.items]));
        setMeta(response.data.meta);
        setError(null);
      })
      .catch((requestError) => {
        if (requestId !== requestRef.current) return;
        setError(requestError instanceof ApiClientError ? requestError.message : "Unable to load the menu.");
      })
      .finally(() => {
        if (requestId !== requestRef.current) return;
        setLoading(false);
        setLoadingMore(false);
      });
  }, [search, category, dietaryKey, sort, page]);

  function changeCategory(value: string) {
    setLoading(true);
    setCategory(value);
    setPage(1);
  }

  function toggleDietary(filter: string) {
    setLoading(true);
    setSelectedDietary((current) =>
      current.includes(filter) ? current.filter((item) => item !== filter) : [...current, filter],
    );
    setPage(1);
  }

  function changeSort(value: MenuSort) {
    setLoading(true);
    setSort(value);
    setPage(1);
  }

  function clearFilters() {
    setLoading(true);
    setSearchInput("");
    setSearch("");
    setCategory("");
    setSelectedDietary([]);
    setPage(1);
  }

  const hasMore = meta ? meta.page < meta.totalPages : false;
  const totalItems = meta?.totalItems ?? 0;

  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
      <MenuSidebar
        categories={categories}
        category={category}
        onCategoryChange={changeCategory}
        onClearFilters={clearFilters}
        onDietaryToggle={toggleDietary}
        onSearchChange={setSearchInput}
        search={searchInput}
        selectedDietary={selectedDietary}
      />

      <section className="min-w-0 flex-1">
        <div className="mb-8 flex flex-col justify-between gap-5 sm:mb-10 md:flex-row md:items-end">
          <div>
            <h1 className="heading-font text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Explore Frozen Meals</h1>
            <p className="mt-2 text-sm text-muted-foreground sm:text-lg">
              Showing {items.length} of {totalItems} freezer-ready options.
            </p>
          </div>
          <Select
            className="w-full md:w-64"
            label="Sort"
            onChange={(value) => changeSort(value as MenuSort)}
            options={menuSortOptions}
            value={sort}
          />
        </div>

        {error ? (
          <div className="flex items-center justify-between gap-4 rounded-2xl border border-error/30 bg-error/5 px-5 py-4 text-sm text-error">
            <span>{error}</span>
            <button className="font-semibold underline" onClick={() => setPage(1)} type="button">
              Retry
            </button>
          </div>
        ) : null}

        {loading ? (
          <div className="rounded-2xl border border-dashed border-border bg-surface-low px-5 py-14 text-center sm:px-6 sm:py-20">
            <p className="text-sm text-muted-foreground">Loading frozen meals...</p>
          </div>
        ) : items.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:gap-6 xl:grid-cols-3">
            {items.map((item) => (
              <MenuCard key={item.id} product={item} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border bg-surface-low px-5 py-14 text-center sm:px-6 sm:py-20">
            <h2 className="heading-font text-2xl font-semibold">No frozen meals found</h2>
            <p className="mt-2 text-sm text-muted-foreground">Try a different search or clear your filters.</p>
            <Button className="mt-6" onClick={clearFilters} variant="outline">
              Clear Filters
            </Button>
          </div>
        )}

        {hasMore && !loading ? (
          <div className="mt-10 flex justify-center sm:mt-16">
            <Button
              className="w-full border-2 border-border px-10 py-4 sm:w-auto"
              disabled={loadingMore}
              onClick={() => {
                setLoadingMore(true);
                setPage((current) => current + 1);
              }}
              variant="outline"
            >
              {loadingMore ? "Loading..." : "Load More"}
              <Icon className="h-4 w-4" name="chevronDown" />
            </Button>
          </div>
        ) : null}
      </section>
    </div>
  );
}

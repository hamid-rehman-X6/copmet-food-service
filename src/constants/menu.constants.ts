import type { DietaryFilter, MenuSort } from "@/types/menu.types";

// Catalog data now lives in the database and is served via /api/v1/products.
// These constants only hold the static filter/sort options used by the menu UI.

export const dietaryFilters: DietaryFilter[] = ["Vegan", "GF", "Organic", "Nut-Free"];

export const menuSortOptions: { label: string; value: MenuSort }[] = [
  { label: "Most Popular", value: "popular" },
  { label: "Newest", value: "newest" },
  { label: "Highest Rated", value: "rating" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
];

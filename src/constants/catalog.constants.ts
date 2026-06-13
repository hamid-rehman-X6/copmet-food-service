import type { ProductStatus } from "@/types/catalog.types";

// Human-friendly labels for the product status enum. These labels also match the
// keys in AdminStatusBadge's tone map so badges colour correctly.
export const productStatusLabels: Record<ProductStatus, string> = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
  OUT_OF_STOCK: "Out of Stock",
  DRAFT: "Draft",
};

export const productStatusOptions: { label: string; value: ProductStatus }[] = [
  { label: "Active", value: "ACTIVE" },
  { label: "Inactive", value: "INACTIVE" },
  { label: "Out of Stock", value: "OUT_OF_STOCK" },
  { label: "Draft", value: "DRAFT" },
];

// Sort options shared between the admin catalog and the public menu.
export const productSortOptions: { label: string; value: string }[] = [
  { label: "Most Popular", value: "popular" },
  { label: "Newest", value: "newest" },
  { label: "Highest Rated", value: "rating" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Name (A–Z)", value: "name" },
];

// Common dietary tags offered as quick toggles in the product form and filters.
export const dietaryTagOptions = ["Vegan", "GF", "Organic", "Nut-Free"] as const;

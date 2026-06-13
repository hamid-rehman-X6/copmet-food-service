import { getPagination, type Pagination } from "@/server/api/pagination";
import type { ProductListFilters, ProductSort } from "@/server/catalog/catalog.repository";
import type { ProductStatus } from "@/types/catalog.types";

const VALID_SORTS: ProductSort[] = ["popular", "newest", "rating", "price-asc", "price-desc", "name"];
const VALID_STATUSES: ProductStatus[] = ["ACTIVE", "INACTIVE", "OUT_OF_STOCK", "DRAFT"];

// Parse list query params shared by the public and admin product endpoints:
// search, category slug, dietary tags, sort, and pagination. Inputs are
// sanitised here so the repository only receives safe, typed filters.
export function parseProductListQuery(searchParams: URLSearchParams, defaultPageSize: number) {
  const search = searchParams.get("search")?.trim() || undefined;
  const categorySlug = searchParams.get("category")?.trim() || undefined;
  const tagsParam = searchParams.get("tags")?.trim();
  const tags = tagsParam ? tagsParam.split(",").map((tag) => tag.trim()).filter(Boolean) : undefined;

  const sortParam = searchParams.get("sort") as ProductSort | null;
  const sort: ProductSort = sortParam && VALID_SORTS.includes(sortParam) ? sortParam : "popular";

  const filters: ProductListFilters = { search, categorySlug, tags };
  const pagination: Pagination = getPagination(searchParams, defaultPageSize);

  return { filters, sort, pagination };
}

/** Resolve an optional, validated status filter for the admin listing. */
export function parseStatusFilter(searchParams: URLSearchParams): ProductStatus[] | undefined {
  const status = searchParams.get("status") as ProductStatus | null;
  return status && VALID_STATUSES.includes(status) ? [status] : undefined;
}

import type { PageMeta } from "@/types/common.types";

const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 100;

export type Pagination = {
  page: number;
  pageSize: number;
  limit: number;
  offset: number;
};

function toPositiveInt(value: string | null, fallback: number) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

/**
 * Parse `page` and `pageSize` query params into safe bounds for SQL LIMIT/OFFSET.
 * Defends against negative, non-numeric, or excessively large page sizes.
 */
export function getPagination(
  searchParams: URLSearchParams,
  defaultPageSize = DEFAULT_PAGE_SIZE,
): Pagination {
  const page = toPositiveInt(searchParams.get("page"), 1);
  const pageSize = Math.min(toPositiveInt(searchParams.get("pageSize"), defaultPageSize), MAX_PAGE_SIZE);

  return { page, pageSize, limit: pageSize, offset: (page - 1) * pageSize };
}

/** Build the pagination metadata returned alongside a page of items. */
export function buildPageMeta(pagination: Pagination, totalItems: number): PageMeta {
  return {
    page: pagination.page,
    pageSize: pagination.pageSize,
    totalItems,
    totalPages: Math.max(1, Math.ceil(totalItems / pagination.pageSize)),
  };
}

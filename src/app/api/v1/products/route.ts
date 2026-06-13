import type { NextRequest } from "next/server";
import { withApiHandler } from "@/server/api/handler";
import { success } from "@/server/api/response";
import { parseProductListQuery } from "@/server/catalog/catalog.query";
import { listPublicProductsService } from "@/server/catalog/catalog.service";

// GET /api/v1/products
// Public storefront catalog. Returns only ACTIVE products with support for
// search, category, dietary tag filtering, sorting, and pagination.
export const GET = withApiHandler(async (request: NextRequest) => {
  const { filters, sort, pagination } = parseProductListQuery(request.nextUrl.searchParams, 12);
  const result = await listPublicProductsService({ filters, sort, pagination });

  return success(result, "Products retrieved.");
});

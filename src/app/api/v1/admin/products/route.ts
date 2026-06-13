import type { NextRequest } from "next/server";
import { productCreateSchema } from "@/schemas/catalog.schemas";
import { withApiHandler } from "@/server/api/handler";
import { assertTrustedOrigin, parseJson } from "@/server/api/request";
import { success } from "@/server/api/response";
import { requireRole } from "@/server/auth/authenticate";
import { parseProductListQuery, parseStatusFilter } from "@/server/catalog/catalog.query";
import { createProductService, listAdminProductsService } from "@/server/catalog/catalog.service";

// GET /api/v1/admin/products
// Admin catalog listing: all statuses, with optional status filter plus the
// shared search/category/tag/sort/pagination params.
export const GET = withApiHandler(async (request: NextRequest) => {
  await requireRole(request, ["ADMIN"]);

  const { filters, sort, pagination } = parseProductListQuery(request.nextUrl.searchParams, 10);
  filters.statuses = parseStatusFilter(request.nextUrl.searchParams);

  const result = await listAdminProductsService({ filters, sort, pagination });
  return success(result, "Products retrieved.");
});

// POST /api/v1/admin/products
// Create a new product. Slug is generated from the name server-side.
export const POST = withApiHandler(async (request: NextRequest) => {
  assertTrustedOrigin(request);
  await requireRole(request, ["ADMIN"]);

  const input = await parseJson(request, productCreateSchema);
  const product = await createProductService(input);

  return success({ product }, "Product created.", 201);
});

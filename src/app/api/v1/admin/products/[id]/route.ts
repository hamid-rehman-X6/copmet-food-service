import type { NextRequest } from "next/server";
import { productUpdateSchema } from "@/schemas/catalog.schemas";
import { withApiHandler } from "@/server/api/handler";
import { assertTrustedOrigin, parseJson } from "@/server/api/request";
import { success } from "@/server/api/response";
import { requireRole } from "@/server/auth/authenticate";
import {
  deleteProductService,
  getAdminProductService,
  updateProductService,
} from "@/server/catalog/catalog.service";

type RouteContext = { params: Promise<{ id: string }> };

// GET /api/v1/admin/products/:id — fetch a single product for editing.
export const GET = withApiHandler(async (request: NextRequest, context: RouteContext) => {
  await requireRole(request, ["ADMIN"]);
  const { id } = await context.params;
  const product = await getAdminProductService(id);

  return success({ product }, "Product retrieved.");
});

// PATCH /api/v1/admin/products/:id — update a product.
export const PATCH = withApiHandler(async (request: NextRequest, context: RouteContext) => {
  assertTrustedOrigin(request);
  await requireRole(request, ["ADMIN"]);
  const { id } = await context.params;
  const input = await parseJson(request, productUpdateSchema);
  const product = await updateProductService(id, input);

  return success({ product }, "Product updated.");
});

// DELETE /api/v1/admin/products/:id — remove a product.
export const DELETE = withApiHandler(async (request: NextRequest, context: RouteContext) => {
  assertTrustedOrigin(request);
  await requireRole(request, ["ADMIN"]);
  const { id } = await context.params;
  await deleteProductService(id);

  return success(null, "Product deleted.");
});

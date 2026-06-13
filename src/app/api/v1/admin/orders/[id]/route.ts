import type { NextRequest } from "next/server";
import { updateOrderStatusSchema } from "@/schemas/order.schemas";
import { withApiHandler } from "@/server/api/handler";
import { assertTrustedOrigin, parseJson } from "@/server/api/request";
import { success } from "@/server/api/response";
import { requireRole } from "@/server/auth/authenticate";
import { getOrderDetailService, updateOrderStatusService } from "@/server/orders/orders.service";

type RouteContext = { params: Promise<{ id: string }> };

// GET /api/v1/admin/orders/:id — full order detail for the admin panel.
export const GET = withApiHandler(async (request: NextRequest, context: RouteContext) => {
  await requireRole(request, ["ADMIN"]);
  const { id } = await context.params;
  const order = await getOrderDetailService(id);

  return success({ order }, "Order retrieved.");
});

// PATCH /api/v1/admin/orders/:id — update the order's fulfilment status.
export const PATCH = withApiHandler(async (request: NextRequest, context: RouteContext) => {
  assertTrustedOrigin(request);
  await requireRole(request, ["ADMIN"]);
  const { id } = await context.params;
  const { status } = await parseJson(request, updateOrderStatusSchema);
  const order = await updateOrderStatusService(id, status);

  return success({ order }, "Order status updated.");
});

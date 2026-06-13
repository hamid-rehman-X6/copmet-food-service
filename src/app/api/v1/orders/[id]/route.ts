import type { NextRequest } from "next/server";
import { withApiHandler } from "@/server/api/handler";
import { success } from "@/server/api/response";
import { requireAccessToken } from "@/server/auth/authenticate";
import { getOrderDetailService } from "@/server/orders/orders.service";

type RouteContext = { params: Promise<{ id: string }> };

// GET /api/v1/orders/:id
// Returns a single order, scoped to the authenticated customer so they can only
// view their own orders (e.g. the post-checkout confirmation).
export const GET = withApiHandler(async (request: NextRequest, context: RouteContext) => {
  const session = await requireAccessToken(request);
  const { id } = await context.params;
  const order = await getOrderDetailService(id, session.userId);

  return success({ order }, "Order retrieved.");
});

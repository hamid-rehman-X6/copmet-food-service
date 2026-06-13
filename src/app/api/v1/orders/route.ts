import type { NextRequest } from "next/server";
import { placeOrderSchema } from "@/schemas/order.schemas";
import { withApiHandler } from "@/server/api/handler";
import { assertTrustedOrigin, parseJson } from "@/server/api/request";
import { success } from "@/server/api/response";
import { requireAccessToken } from "@/server/auth/authenticate";
import { placeOrder } from "@/server/orders/orders.service";

// POST /api/v1/orders
// Place an order for the authenticated customer. Prices and totals are computed
// server-side from the catalog and store settings.
export const POST = withApiHandler(async (request: NextRequest) => {
  assertTrustedOrigin(request);
  const session = await requireAccessToken(request);
  const input = await parseJson(request, placeOrderSchema);
  const order = await placeOrder(input, session.userId);

  return success({ order }, "Your frozen order has been placed.", 201);
});

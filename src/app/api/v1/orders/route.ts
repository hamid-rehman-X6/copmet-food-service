import type { NextRequest } from "next/server";
import { placeOrderSchema } from "@/schemas/order.schemas";
import { withApiHandler } from "@/server/api/handler";
import { assertTrustedOrigin, parseJson } from "@/server/api/request";
import { success } from "@/server/api/response";
import { requireAccessToken } from "@/server/auth/authenticate";
import { placeOrder } from "@/server/orders/orders.service";
import { buildOrderWhatsappUrl } from "@/server/orders/whatsapp";
import { getSettings } from "@/server/settings/settings.service";

// POST /api/v1/orders
// Place an order for the authenticated customer. Prices and totals are computed
// server-side from the catalog and store settings. The response also includes a
// WhatsApp deep link so the customer can send the full order to the admin.
export const POST = withApiHandler(async (request: NextRequest) => {
  assertTrustedOrigin(request);
  const session = await requireAccessToken(request);
  const input = await parseJson(request, placeOrderSchema);
  const order = await placeOrder(input, session.userId);
  const whatsappUrl = buildOrderWhatsappUrl(order, await getSettings());

  return success({ order, whatsappUrl }, "Your frozen order has been placed.", 201);
});

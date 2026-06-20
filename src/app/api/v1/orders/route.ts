import type { NextRequest } from "next/server";
import { placeOrderSchema } from "@/schemas/order.schemas";
import { withApiHandler } from "@/server/api/handler";
import { getPagination } from "@/server/api/pagination";
import { assertTrustedOrigin, parseJson } from "@/server/api/request";
import { success } from "@/server/api/response";
import { requireAccessToken } from "@/server/auth/authenticate";
import { listActiveWhatsappNumbersService } from "@/server/admin/whatsapp.service";
import { listOrdersService, placeOrder } from "@/server/orders/orders.service";
import { buildOrderWhatsappLinks } from "@/server/orders/whatsapp";
import { getSettings } from "@/server/settings/settings.service";

// GET /api/v1/orders
// The authenticated customer's own order history, newest first, paginated.
export const GET = withApiHandler(async (request: NextRequest) => {
  const session = await requireAccessToken(request);
  const pagination = getPagination(request.nextUrl.searchParams, 10);
  const result = await listOrdersService({ filters: { userId: session.userId }, pagination });

  return success(result, "Your orders were retrieved.");
});

// POST /api/v1/orders
// Place an order for the authenticated customer. Prices and totals are computed
// server-side from the catalog and store settings. The response also includes a
// WhatsApp deep link so the customer can send the full order to the admin.
export const POST = withApiHandler(async (request: NextRequest) => {
  assertTrustedOrigin(request);
  const session = await requireAccessToken(request);
  const input = await parseJson(request, placeOrderSchema);
  const order = await placeOrder(input, session.userId);
  const [settings, activeNumbers] = await Promise.all([getSettings(), listActiveWhatsappNumbersService()]);
  const whatsappLinks = buildOrderWhatsappLinks(order, settings, activeNumbers);

  return success({ order, whatsappLinks }, "Your frozen order has been placed.", 201);
});

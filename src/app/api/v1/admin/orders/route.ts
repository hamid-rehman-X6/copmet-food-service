import type { NextRequest } from "next/server";
import { orderStatuses } from "@/schemas/order.schemas";
import { withApiHandler } from "@/server/api/handler";
import { getPagination } from "@/server/api/pagination";
import { success } from "@/server/api/response";
import { requireRole } from "@/server/auth/authenticate";
import { listOrdersService } from "@/server/orders/orders.service";
import type { OrderListFilters } from "@/server/orders/orders.repository";
import type { OrderStatus } from "@/types/order.types";

// GET /api/v1/admin/orders
// Admin order listing with optional status + search filters and pagination.
export const GET = withApiHandler(async (request: NextRequest) => {
  await requireRole(request, ["ADMIN"]);

  const searchParams = request.nextUrl.searchParams;
  const statusParam = searchParams.get("status") as OrderStatus | null;

  const filters: OrderListFilters = {
    search: searchParams.get("search")?.trim() || undefined,
    status: statusParam && orderStatuses.includes(statusParam) ? statusParam : undefined,
  };

  const result = await listOrdersService({ filters, pagination: getPagination(searchParams, 10) });
  return success(result, "Orders retrieved.");
});

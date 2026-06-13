import type { NextRequest } from "next/server";
import { withApiHandler } from "@/server/api/handler";
import { success } from "@/server/api/response";
import { requireRole } from "@/server/auth/authenticate";
import { getCustomerDetailService } from "@/server/customers/customers.service";

type RouteContext = { params: Promise<{ id: string }> };

// GET /api/v1/admin/customers/:id
// Customer profile with aggregates and their recent orders (read-only).
export const GET = withApiHandler(async (request: NextRequest, context: RouteContext) => {
  await requireRole(request, ["ADMIN"]);
  const { id } = await context.params;
  const customer = await getCustomerDetailService(id);

  return success({ customer }, "Customer retrieved.");
});

import type { NextRequest } from "next/server";
import { withApiHandler } from "@/server/api/handler";
import { getPagination } from "@/server/api/pagination";
import { success } from "@/server/api/response";
import { requireRole } from "@/server/auth/authenticate";
import { listCustomersService } from "@/server/customers/customers.service";
import type { CustomerListFilters } from "@/server/customers/customers.repository";

// GET /api/v1/admin/customers
// Admin customer listing (read-only) with search + status filters, newest
// first, and pagination.
export const GET = withApiHandler(async (request: NextRequest) => {
  await requireRole(request, ["ADMIN"]);

  const searchParams = request.nextUrl.searchParams;
  const statusParam = searchParams.get("status");

  const filters: CustomerListFilters = {
    search: searchParams.get("search")?.trim() || undefined,
    active: statusParam === "active" ? true : statusParam === "inactive" ? false : undefined,
  };

  const result = await listCustomersService({ filters, pagination: getPagination(searchParams, 10) });
  return success(result, "Customers retrieved.");
});

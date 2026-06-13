import type { NextRequest } from "next/server";
import { withApiHandler } from "@/server/api/handler";
import { success } from "@/server/api/response";
import { requireRole } from "@/server/auth/authenticate";
import { getDashboardService } from "@/server/dashboard/dashboard.service";

// GET /api/v1/admin/dashboard
// Headline metrics, recent orders, and popular products for the admin overview.
export const GET = withApiHandler(async (request: NextRequest) => {
  await requireRole(request, ["ADMIN"]);
  const data = await getDashboardService();

  return success(data, "Dashboard data retrieved.");
});

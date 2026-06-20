import type { NextRequest } from "next/server";
import { updateAdminProfileSchema } from "@/schemas/admin.schemas";
import { withApiHandler } from "@/server/api/handler";
import { assertTrustedOrigin, parseJson } from "@/server/api/request";
import { success } from "@/server/api/response";
import { requireRole } from "@/server/auth/authenticate";
import { getAdminProfile, updateAdminProfile } from "@/server/admin/admin-profile.service";

// GET /api/v1/admin/profile — the admin's display name, email, and avatar.
export const GET = withApiHandler(async (request: NextRequest) => {
  await requireRole(request, ["ADMIN"]);
  const profile = await getAdminProfile();

  return success({ profile }, "Admin profile retrieved.");
});

// PATCH /api/v1/admin/profile — update the admin display name.
export const PATCH = withApiHandler(async (request: NextRequest) => {
  assertTrustedOrigin(request);
  await requireRole(request, ["ADMIN"]);
  const input = await parseJson(request, updateAdminProfileSchema);
  const profile = await updateAdminProfile(input);

  return success({ profile }, "Admin profile updated.");
});

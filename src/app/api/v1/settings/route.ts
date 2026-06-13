import type { NextRequest } from "next/server";
import { updateSettingsSchema } from "@/schemas/settings.schemas";
import { withApiHandler } from "@/server/api/handler";
import { assertTrustedOrigin, parseJson } from "@/server/api/request";
import { success } from "@/server/api/response";
import { requireRole } from "@/server/auth/authenticate";
import { getSettings, updateSettings } from "@/server/settings/settings.service";

// GET /api/v1/settings
// Public: the storefront reads currency/delivery config to format prices.
export const GET = withApiHandler(async () => {
  const settings = await getSettings();
  return success({ settings }, "Store settings retrieved.");
});

// PATCH /api/v1/settings
// Admin only: update currency and delivery configuration.
export const PATCH = withApiHandler(async (request: NextRequest) => {
  assertTrustedOrigin(request);
  await requireRole(request, ["ADMIN"]);
  const input = await parseJson(request, updateSettingsSchema);
  const settings = await updateSettings(input);

  return success({ settings }, "Store settings updated.");
});

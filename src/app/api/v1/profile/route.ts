import type { NextRequest } from "next/server";
import { updateProfileSchema } from "@/schemas/profile.schemas";
import { withApiHandler } from "@/server/api/handler";
import { assertTrustedOrigin, parseJson } from "@/server/api/request";
import { success } from "@/server/api/response";
import { requireAccessToken } from "@/server/auth/authenticate";
import { updateProfile } from "@/server/profile/profile.service";

// PATCH /api/v1/profile
// Update the signed-in user's name and email. Returns the refreshed profile.
export const PATCH = withApiHandler(async (request: NextRequest) => {
  assertTrustedOrigin(request);
  const session = await requireAccessToken(request);
  const input = await parseJson(request, updateProfileSchema);
  const user = await updateProfile(session.userId, input);

  return success({ user }, "Your profile has been updated.");
});

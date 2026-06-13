import type { NextRequest } from "next/server";
import { changePasswordSchema } from "@/schemas/profile.schemas";
import { withApiHandler } from "@/server/api/handler";
import { assertTrustedOrigin, parseJson } from "@/server/api/request";
import { success } from "@/server/api/response";
import { requireAccessToken } from "@/server/auth/authenticate";
import { changePassword } from "@/server/profile/profile.service";

// PATCH /api/v1/profile/password
// Change the signed-in user's password after verifying the current one.
export const PATCH = withApiHandler(async (request: NextRequest) => {
  assertTrustedOrigin(request);
  const session = await requireAccessToken(request);
  const input = await parseJson(request, changePasswordSchema);
  await changePassword(session.userId, input);

  return success(null, "Your password has been updated.");
});

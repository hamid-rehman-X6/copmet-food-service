import type { NextRequest } from "next/server";
import { withApiHandler } from "@/server/api/handler";
import { assertTrustedOrigin } from "@/server/api/request";
import { success } from "@/server/api/response";
import { authCookies } from "@/server/auth/auth.constants";
import { clearAuthCookies } from "@/server/auth/cookies";
import { logout } from "@/server/auth/auth.service";

export const POST = withApiHandler(async (request: NextRequest) => {
  assertTrustedOrigin(request);
  await logout(request.cookies.get(authCookies.refresh)?.value);

  const response = success(null, "You have been signed out.");
  clearAuthCookies(response);
  return response;
});

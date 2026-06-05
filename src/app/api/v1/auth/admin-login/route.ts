import type { NextRequest } from "next/server";
import { loginSchema } from "@/schemas/auth.schemas";
import { withApiHandler } from "@/server/api/handler";
import { assertTrustedOrigin, parseJson } from "@/server/api/request";
import { success } from "@/server/api/response";
import { authCookies } from "@/server/auth/auth.constants";
import { loginEnvAdmin } from "@/server/auth/admin-auth.service";
import { setAccessCookie } from "@/server/auth/cookies";

export const POST = withApiHandler(async (request: NextRequest) => {
  assertTrustedOrigin(request);
  const input = await parseJson(request, loginSchema);
  const result = await loginEnvAdmin(input);
  const response = success({ user: result.user }, "Admin signed in.");

  setAccessCookie(response, result.accessToken);
  response.cookies.set(authCookies.refresh, "", { httpOnly: true, sameSite: "lax", path: "/api/v1/auth", maxAge: 0 });

  return response;
});

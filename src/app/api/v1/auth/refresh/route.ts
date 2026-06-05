import type { NextRequest } from "next/server";
import { errors } from "@/server/api/errors";
import { withApiHandler } from "@/server/api/handler";
import { assertTrustedOrigin, getRequestContext } from "@/server/api/request";
import { success } from "@/server/api/response";
import { authCookies } from "@/server/auth/auth.constants";
import { setAuthCookies } from "@/server/auth/cookies";
import { refresh } from "@/server/auth/auth.service";

export const POST = withApiHandler(async (request: NextRequest) => {
  assertTrustedOrigin(request);
  const refreshToken = request.cookies.get(authCookies.refresh)?.value;

  if (!refreshToken) {
    throw errors.unauthorized("A refresh session is required.");
  }

  const result = await refresh(refreshToken, getRequestContext(request));
  const response = success({ user: result.user }, "Your session has been refreshed.");

  setAuthCookies(response, result.tokens);
  return response;
});

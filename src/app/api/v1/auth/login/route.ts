import type { NextRequest } from "next/server";
import { loginSchema } from "@/schemas/auth.schemas";
import { withApiHandler } from "@/server/api/handler";
import { assertTrustedOrigin, getRequestContext, parseJson } from "@/server/api/request";
import { success } from "@/server/api/response";
import { login } from "@/server/auth/auth.service";
import { setAuthCookies } from "@/server/auth/cookies";

export const POST = withApiHandler(async (request: NextRequest) => {
  assertTrustedOrigin(request);
  const input = await parseJson(request, loginSchema);
  const result = await login(input, getRequestContext(request));
  const response = success({ user: result.user }, "You are now signed in.");

  setAuthCookies(response, result.tokens);
  return response;
});

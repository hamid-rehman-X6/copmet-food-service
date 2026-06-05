import type { NextRequest } from "next/server";
import { signupSchema } from "@/schemas/auth.schemas";
import { withApiHandler } from "@/server/api/handler";
import { assertTrustedOrigin, getRequestContext, parseJson } from "@/server/api/request";
import { success } from "@/server/api/response";
import { setAuthCookies } from "@/server/auth/cookies";
import { signup } from "@/server/auth/auth.service";

export const POST = withApiHandler(async (request: NextRequest) => {
  assertTrustedOrigin(request);
  const input = await parseJson(request, signupSchema);
  const result = await signup(input, getRequestContext(request));
  const response = success({ user: result.user }, "Your account has been created.", 201);

  setAuthCookies(response, result.tokens);
  return response;
});

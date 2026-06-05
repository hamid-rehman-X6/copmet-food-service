import type { NextRequest } from "next/server";
import { withApiHandler } from "@/server/api/handler";
import { success } from "@/server/api/response";
import { requireAccessToken } from "@/server/auth/authenticate";
import { getUserById } from "@/server/auth/auth.service";

export const GET = withApiHandler(async (request: NextRequest) => {
  const session = await requireAccessToken(request);
  const user = await getUserById(session.userId);

  return success({ user }, "Authenticated user retrieved.");
});

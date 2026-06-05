import type { NextRequest } from "next/server";
import { withApiHandler } from "@/server/api/handler";
import { success } from "@/server/api/response";
import { envAdminUserId, getEnvAdminUser } from "@/server/auth/admin-auth.service";
import { requireAccessToken } from "@/server/auth/authenticate";
import { getUserById } from "@/server/auth/auth.service";

export const GET = withApiHandler(async (request: NextRequest) => {
  const session = await requireAccessToken(request);
  const user = session.userId === envAdminUserId && session.role === "ADMIN" ? getEnvAdminUser() : await getUserById(session.userId);

  return success({ user }, "Authenticated user retrieved.");
});

import type { NextRequest } from "next/server";
import { errors } from "@/server/api/errors";
import { authCookies } from "@/server/auth/auth.constants";
import { verifyAccessToken } from "@/server/auth/tokens";
import type { UserRole } from "@/types/auth.types";

export async function requireAccessToken(request: NextRequest) {
  const token = request.cookies.get(authCookies.access)?.value;

  if (!token) {
    throw errors.unauthorized();
  }

  return verifyAccessToken(token);
}

export async function requireRole(request: NextRequest, allowedRoles: UserRole[]) {
  const session = await requireAccessToken(request);

  if (!allowedRoles.includes(session.role)) {
    throw errors.forbidden();
  }

  return session;
}

import { timingSafeEqual } from "node:crypto";
import { errors } from "@/server/api/errors";
import { signAccessToken } from "@/server/auth/tokens";
import { env } from "@/server/config/env";
import type { LoginInput } from "@/schemas/auth.schemas";
import type { AuthUser } from "@/types/auth.types";

export const envAdminUserId = "env-admin";

export function getEnvAdminUser(): AuthUser {
  return {
    id: envAdminUserId,
    firstName: "Dev",
    lastName: "Admin",
    email: env.adminEmail,
    role: "ADMIN",
    createdAt: new Date(0).toISOString(),
  };
}

export async function loginEnvAdmin(input: LoginInput) {
  if (!secureEqual(input.email, env.adminEmail) || !secureEqual(input.password, env.adminPassword)) {
    throw errors.unauthorized("The admin email address or password is incorrect.");
  }

  const user = getEnvAdminUser();

  return {
    user,
    accessToken: await signAccessToken(user),
  };
}

function secureEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

import { createHash } from "node:crypto";
import { jwtVerify, SignJWT } from "jose";
import { errors } from "@/server/api/errors";
import { authTokenMetadata, authTokenTtl } from "@/server/auth/auth.constants";
import { env } from "@/server/config/env";
import type { AuthUser, UserRole } from "@/types/auth.types";

type AccessTokenPayload = {
  type: "access";
  email: string;
  role: UserRole;
};

type RefreshTokenPayload = {
  type: "refresh";
  sessionId: string;
  familyId: string;
};

const encoder = new TextEncoder();

export function signAccessToken(user: AuthUser) {
  const payload: AccessTokenPayload = { type: "access", email: user.email, role: user.role };

  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt()
    .setIssuer(authTokenMetadata.issuer)
    .setAudience(authTokenMetadata.audience)
    .setSubject(user.id)
    .setExpirationTime(`${authTokenTtl.accessSeconds}s`)
    .sign(encoder.encode(env.accessSecret));
}

export function signRefreshToken(input: { userId: string; sessionId: string; familyId: string; expiresIn: number }) {
  const payload: RefreshTokenPayload = {
    type: "refresh",
    sessionId: input.sessionId,
    familyId: input.familyId,
  };

  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt()
    .setIssuer(authTokenMetadata.issuer)
    .setAudience(authTokenMetadata.audience)
    .setSubject(input.userId)
    .setExpirationTime(`${input.expiresIn}s`)
    .sign(encoder.encode(env.refreshSecret));
}

export async function verifyAccessToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, encoder.encode(env.accessSecret), authTokenMetadata);

    if (
      payload.type !== "access" ||
      typeof payload.sub !== "string" ||
      typeof payload.email !== "string" ||
      (payload.role !== "CUSTOMER" && payload.role !== "ADMIN")
    ) {
      throw new Error("Invalid access-token payload.");
    }

    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role as UserRole,
    };
  } catch {
    throw errors.unauthorized("Your access token is invalid or expired.");
  }
}

export async function verifyRefreshToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, encoder.encode(env.refreshSecret), authTokenMetadata);

    if (
      payload.type !== "refresh" ||
      typeof payload.sub !== "string" ||
      typeof payload.sessionId !== "string" ||
      typeof payload.familyId !== "string"
    ) {
      throw new Error("Invalid refresh-token payload.");
    }

    return {
      userId: payload.sub,
      sessionId: payload.sessionId,
      familyId: payload.familyId,
    };
  } catch {
    throw errors.unauthorized("Your session is invalid or expired.");
  }
}

export function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

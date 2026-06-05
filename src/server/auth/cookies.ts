import type { NextResponse } from "next/server";
import { authCookies, authTokenTtl } from "@/server/auth/auth.constants";
import { env } from "@/server/config/env";

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
  refreshExpiresIn: number;
  rememberMe: boolean;
};

const commonCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: env.isProduction,
  path: "/",
};

export function setAuthCookies(response: NextResponse, tokens: AuthTokens) {
  response.cookies.set(authCookies.access, tokens.accessToken, {
    ...commonCookieOptions,
    maxAge: authTokenTtl.accessSeconds,
  });

  response.cookies.set(authCookies.refresh, tokens.refreshToken, {
    ...commonCookieOptions,
    path: "/api/v1/auth",
    ...(tokens.rememberMe ? { maxAge: tokens.refreshExpiresIn } : {}),
  });
}

export function clearAuthCookies(response: NextResponse) {
  response.cookies.set(authCookies.access, "", { ...commonCookieOptions, maxAge: 0 });
  response.cookies.set(authCookies.refresh, "", { ...commonCookieOptions, path: "/api/v1/auth", maxAge: 0 });
}

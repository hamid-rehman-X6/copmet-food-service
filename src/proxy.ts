import { jwtVerify } from "jose";
import { NextResponse, type NextRequest } from "next/server";
import { authCookies, authTokenMetadata } from "@/server/auth/auth.constants";

const encoder = new TextEncoder();

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  const token = request.cookies.get(authCookies.access)?.value;

  if (token && (await isEnvAdminToken(token))) {
    return NextResponse.next();
  }

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/admin/login";
  loginUrl.search = "";
  loginUrl.searchParams.set("next", `${pathname}${search}`);

  return NextResponse.redirect(loginUrl);
}

async function isEnvAdminToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, encoder.encode(process.env.JWT_ACCESS_SECRET), authTokenMetadata);
    const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();

    return payload.type === "access" && payload.sub === "env-admin" && payload.email === adminEmail && payload.role === "ADMIN";
  } catch {
    return false;
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};

import type { NextRequest } from "next/server";
import type { ZodType } from "zod";
import { errors } from "@/server/api/errors";
import { env } from "@/server/config/env";

export async function parseJson<T>(request: NextRequest, schema: ZodType<T>) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    throw errors.badRequest("A valid JSON request body is required.");
  }

  return schema.parse(body);
}

// SameSite cookies block most cross-site requests. This additional origin check
// protects state-changing endpoints when deployed behind normal same-origin clients.
export function assertTrustedOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");

  if (!origin) {
    return;
  }

  const allowedOrigins = new Set([request.nextUrl.origin, new URL(env.appUrl).origin]);

  if (!allowedOrigins.has(origin)) {
    throw errors.forbidden("The request origin is not allowed.");
  }
}

export function getRequestContext(request: NextRequest) {
  return {
    userAgent: request.headers.get("user-agent"),
    ipAddress: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? request.headers.get("x-real-ip"),
  };
}

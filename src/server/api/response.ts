import { NextResponse } from "next/server";

export type ApiSuccess<T> = {
  success: true;
  message: string;
  data: T;
};

export type ApiFailure = {
  success: false;
  message: string;
  error: {
    code: string;
    details?: unknown;
  };
};

export function success<T>(data: T, message = "Request completed successfully.", status = 200) {
  return NextResponse.json<ApiSuccess<T>>(
    { success: true, message, data },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}

export function failure(message: string, code: string, status: number, details?: unknown) {
  return NextResponse.json<ApiFailure>(
    {
      success: false,
      message,
      error: {
        code,
        ...(details === undefined ? {} : { details }),
      },
    },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}

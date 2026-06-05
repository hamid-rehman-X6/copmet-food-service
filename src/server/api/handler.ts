import { ZodError } from "zod";
import { AppError } from "@/server/api/errors";
import { failure } from "@/server/api/response";

type RouteHandler<TArgs extends unknown[]> = (...args: TArgs) => Promise<Response>;

export function withApiHandler<TArgs extends unknown[]>(handler: RouteHandler<TArgs>) {
  return async (...args: TArgs) => {
    try {
      return await handler(...args);
    } catch (error) {
      if (error instanceof ZodError) {
        return failure("Please correct the invalid fields.", "VALIDATION_ERROR", 422, error.flatten().fieldErrors);
      }

      if (error instanceof AppError) {
        return failure(error.message, error.code, error.status, error.details);
      }

      if (isPostgresError(error) && error.code === "23505") {
        return failure("A record with these details already exists.", "CONFLICT", 409);
      }

      console.error("Unhandled API error", error);
      return failure("An unexpected server error occurred.", "INTERNAL_SERVER_ERROR", 500);
    }
  };
}

function isPostgresError(error: unknown): error is { code: string } {
  return typeof error === "object" && error !== null && "code" in error;
}

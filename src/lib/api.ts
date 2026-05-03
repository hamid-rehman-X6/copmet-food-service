// Standardized API response creators for all route handlers.
import type { ApiResponse, FieldError } from "@/types/api";

export function createSuccessResponse<T>(
  data: T,
  message = "Request completed successfully.",
): ApiResponse<T> {
  return {
    data,
    error: null,
    message,
  };
}

export function createErrorResponse<T>(
  message: string,
  errors: FieldError[] = [],
): ApiResponse<T> {
  return {
    data: null,
    error: errors.length > 0 ? errors : null,
    message,
  };
}

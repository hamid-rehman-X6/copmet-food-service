// Shared API response typing for all route handlers.
export interface FieldError {
  field: string;
  message: string;
}

export interface ApiResponse<T> {
  data: T | null;
  error: FieldError[] | null;
  message: string;
}

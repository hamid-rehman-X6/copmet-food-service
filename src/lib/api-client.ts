type ApiSuccess<T> = {
  success: true;
  message: string;
  data: T;
};

type ApiFailure = {
  success: false;
  message: string;
  error: {
    code: string;
    details?: unknown;
  };
};

export class ApiClientError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
  config: { retryOnUnauthorized?: boolean } = {},
): Promise<ApiSuccess<T>> {
  const response = await fetch(path, {
    ...options,
    credentials: "include",
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });

  if (
    response.status === 401 &&
    config.retryOnUnauthorized !== false &&
    !path.endsWith("/refresh") &&
    !path.endsWith("/login") &&
    !path.endsWith("/signup")
  ) {
    const refreshed = await fetch("/api/v1/auth/refresh", {
      method: "POST",
      credentials: "include",
    });

    if (refreshed.ok) {
      return apiRequest<T>(path, options, { retryOnUnauthorized: false });
    }
  }

  const payload = (await response.json()) as ApiSuccess<T> | ApiFailure;

  if (!response.ok || !payload.success) {
    const failure = payload as ApiFailure;
    throw new ApiClientError(
      failure.message || "The request could not be completed.",
      response.status,
      failure.error?.code ?? "REQUEST_FAILED",
      failure.error?.details,
    );
  }

  return payload;
}

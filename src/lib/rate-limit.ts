// Minimal in-memory rate limiter for sensitive endpoints.
const requestLog = new Map<string, number[]>();

interface RateLimitConfig {
  key: string;
  limit: number;
  windowMs: number;
}

export function isRateLimited({ key, limit, windowMs }: RateLimitConfig): boolean {
  const now = Date.now();
  const timestamps = requestLog.get(key) ?? [];
  const activeWindow = timestamps.filter((timestamp) => now - timestamp < windowMs);
  activeWindow.push(now);
  requestLog.set(key, activeWindow);
  return activeWindow.length > limit;
}

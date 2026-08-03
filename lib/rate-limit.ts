/**
 * Minimal in-memory sliding-window rate limiter.
 * Suitable for single-instance deployments / development.
 * For multi-instance production, swap in Redis or Upstash Rate Limiting.
 */
const hits = new Map<string, number[]>();

export interface RateLimiterOptions {
  /** number of allowed requests */
  limit?: number;
  /** window in seconds */
  windowMs?: number;
}

export function rateLimit(identifier: string, { limit = 20, windowMs = 60_000 }: RateLimiterOptions = {}) {
  const now = Date.now();
  const windowStart = now - windowMs;
  const current = (hits.get(identifier) ?? []).filter((t) => t > windowStart);
  if (current.length >= limit) {
    return { ok: false as const, retryAfter: Math.ceil((windowStart + windowMs - now) / 1000) };
  }
  current.push(now);
  hits.set(identifier, current);
  return { ok: true as const };
}

export function getClientIp(headers: Headers): string {
  const fwd = headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return headers.get("x-real-ip") ?? "unknown";
}
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { ApiError } from "@/lib/auth";

export function ok<T>(data: T, init?: ResponseInit): NextResponse {
  return NextResponse.json({ success: true, data }, init);
}

export function fail(message: string, status = 400, meta?: Record<string, unknown>): NextResponse {
  return NextResponse.json({ success: false, error: message, ...(meta ? { meta } : {}) }, { status });
}

export function handleError(error: unknown): NextResponse {
  if (error instanceof ZodError) {
    const issues = error.issues.map((i) => ({ path: i.path.join("."), message: i.message }));
    return NextResponse.json({ success: false, error: "Validation failed", issues }, { status: 422 });
  }
  if (error instanceof ApiError) {
    return fail(error.message, error.status);
  }
  if (error instanceof Error) {
    console.error(`[api] ${error.message}`, error.stack);
    return fail(error.message, 500);
  }
  return fail("Something went wrong", 500);
}

export function withRateLimit(request: Request, limit = 30, windowMs = 60_000): NextResponse | null {
  const ip = getClientIp(request.headers);
  const res = rateLimit(ip, { limit, windowMs });
  if (!res.ok) {
    return fail("Too many requests. Please try again later.", 429, { retryAfter: res.retryAfter });
  }
  return null;
}

export function requireAdminWrapper(fn: () => Promise<NextResponse>): Promise<NextResponse> {
  return fn().catch((e) => {
    if (e instanceof ApiError) return fail(e.message, e.status);
    console.error(e);
    return fail("Internal server error", 500);
  });
}
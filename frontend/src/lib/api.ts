import { NextResponse } from "next/server";
import { ZodError, type ZodTypeAny, type z } from "zod";
import { AuthError } from "@/lib/auth";
import { formatZodIssues } from "@/schemas";
import type { ApiResponse } from "@/types";

/** Uniform success envelope — every handler returns this shape. */
export function ok<T>(
  data: T,
  meta?: { total?: number; page?: number; limit?: number; pages?: number },
  init?: ResponseInit,
) {
  return NextResponse.json<ApiResponse<T>>({ success: true, data, meta }, init);
}

export function fail(
  error: string,
  status = 400,
  issues?: Record<string, string[]>,
) {
  return NextResponse.json<ApiResponse<never>>(
    { success: false, error, issues },
    { status },
  );
}

/**
 * Wraps a handler so thrown errors never leak stack traces to the client and
 * always come back in the standard envelope.
 */
export function handler<Args extends unknown[]>(
  fn: (...args: Args) => Promise<Response>,
) {
  return async (...args: Args): Promise<Response> => {
    try {
      return await fn(...args);
    } catch (error) {
      if (error instanceof AuthError) return fail(error.message, error.status);
      if (error instanceof ZodError) {
        return fail("Validation failed", 422, formatZodIssues(error));
      }

      const message = error instanceof Error ? error.message : "Unexpected error";

      // Duplicate key — surface the field, not the raw Mongo error.
      if (message.includes("E11000")) {
        const field = /index: (\w+)_/.exec(message)?.[1] ?? "value";
        return fail(`That ${field} is already taken`, 409);
      }

      console.error("[api]", error);
      return fail(
        process.env.NODE_ENV === "production" ? "Something went wrong" : message,
        500,
      );
    }
  };
}

/**
 * Parses + validates a JSON body, throwing a ZodError the wrapper handles.
 *
 * Generic over the schema rather than its output type: schemas using
 * `.default()` have a different input type to their output, and
 * `ZodSchema<T>` would unify the two and hand back everything as optional.
 * `z.infer<S>` always gives the post-parse shape.
 */
export async function parseBody<S extends ZodTypeAny>(
  request: Request,
  schema: S,
): Promise<z.infer<S>> {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    throw new ZodError([
      { code: "custom", path: ["body"], message: "Request body must be valid JSON" },
    ]);
  }
  return schema.parse(json) as z.infer<S>;
}

/** Parses search params through a schema (all values arrive as strings). */
export function parseQuery<S extends ZodTypeAny>(request: Request, schema: S): z.infer<S> {
  const params = Object.fromEntries(new URL(request.url).searchParams.entries());
  return schema.parse(params) as z.infer<S>;
}

/* ── Rate limiting ───────────────────────────────────────────
   In-memory sliding window. Good enough for a single-instance
   portfolio; swap for Upstash/Redis if this ever runs multi-region.
   ──────────────────────────────────────────────────────────── */
const buckets = new Map<string, number[]>();

export function rateLimit(key: string, limit = 5, windowMs = 60_000) {
  const now = Date.now();
  const hits = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  hits.push(now);
  buckets.set(key, hits);

  // Opportunistic cleanup so the map can't grow unbounded.
  if (buckets.size > 5_000) {
    for (const [k, v] of buckets) {
      if (v.every((t) => now - t > windowMs)) buckets.delete(k);
    }
  }

  return {
    allowed: hits.length <= limit,
    remaining: Math.max(0, limit - hits.length),
    retryAfter: Math.ceil(windowMs / 1000),
  };
}

export function clientIp(request: Request) {
  const headers = request.headers;
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headers.get("x-real-ip") ??
    "unknown"
  );
}

export function deviceFromUA(ua: string): "desktop" | "tablet" | "mobile" {
  if (/iPad|Tablet|PlayBook|Silk/i.test(ua)) return "tablet";
  if (/Mobi|Android|iPhone|iPod/i.test(ua)) return "mobile";
  return "desktop";
}

export function browserFromUA(ua: string) {
  if (/Edg\//.test(ua)) return "Edge";
  if (/OPR\//.test(ua)) return "Opera";
  if (/Chrome\//.test(ua)) return "Chrome";
  if (/Safari\//.test(ua)) return "Safari";
  if (/Firefox\//.test(ua)) return "Firefox";
  return "Other";
}

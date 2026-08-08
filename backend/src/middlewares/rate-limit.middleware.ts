import type { Request, Response, NextFunction } from "express";

const buckets = new Map<string, number[]>();

export function rateLimit(key: string, limit = 5, windowMs = 60_000) {
  const now = Date.now();
  const hits = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  hits.push(now);
  buckets.set(key, hits);

  // Opportunistic cleanup
  if (buckets.size > 5000) {
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

export function clientIp(req: Request): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (forwarded) {
    return (Array.isArray(forwarded) ? forwarded[0] : forwarded.split(",")[0]).trim();
  }
  return req.socket.remoteAddress || "unknown";
}

export function createRateLimiter(
  prefix: string,
  limit = 5,
  windowMs = 60_000,
  message = "Too many requests. Please try again later."
) {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = clientIp(req);
    const key = `${prefix}:${ip}`;
    const check = rateLimit(key, limit, windowMs);

    if (!check.allowed) {
      return res.status(429).json({
        success: false,
        error: message,
      });
    }

    next();
  };
}

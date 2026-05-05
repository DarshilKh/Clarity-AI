import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Singleton Redis client
let redis: Redis | null = null;
function getRedis(): Redis {
  if (!redis) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
  }
  return redis;
}

// ─── Rate limiters ────────────────────────────────────────────────────────────

// Free tier: 2 analyses per 24 hours per user/IP
// Why 2? Enough to try the product meaningfully, forces upgrade for power users
export const analysisRatelimit = new Ratelimit({
  redis: getRedis(),
  limiter: Ratelimit.slidingWindow(2, "24 h"),
  analytics: true,
  prefix: "clarity:analysis",
});

// Auth endpoints: 5 attempts per 15 minutes (prevents brute force)
export const authRatelimit = new Ratelimit({
  redis: getRedis(),
  limiter: Ratelimit.slidingWindow(5, "15 m"),
  analytics: true,
  prefix: "clarity:auth",
});

// Forgot password: 3 per hour (prevents email spam)
export const passwordResetRatelimit = new Ratelimit({
  redis: getRedis(),
  limiter: Ratelimit.slidingWindow(3, "1 h"),
  analytics: true,
  prefix: "clarity:pwreset",
});

// ─── Helper: get identifier (prefer user ID, fallback to IP) ─────────────────
export function getRatelimitIdentifier(
  req: Request,
  userId?: string | null
): string {
  if (userId) return `user:${userId}`;
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";
  return `ip:${ip}`;
}

// ─── Helper: build 429 response with helpful headers ─────────────────────────
export function rateLimitResponse(reset: number, remaining: number) {
  const retryAfterSeconds = Math.ceil((reset - Date.now()) / 1000);
  const resetDate = new Date(reset).toISOString();

  return new Response(
    JSON.stringify({
      error: "rate_limit_exceeded",
      message:
        "You've used your 2 free analyses for today. Upgrade to Pro for unlimited analyses.",
      resetAt: resetDate,
      retryAfterSeconds,
      remaining,
      upgradeUrl: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
    }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "X-RateLimit-Remaining": String(remaining),
        "X-RateLimit-Reset": resetDate,
        "Retry-After": String(retryAfterSeconds),
      },
    }
  );
}

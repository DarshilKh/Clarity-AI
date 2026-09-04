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

// Allowances live in lib/plan.ts so client components can read them without
// pulling in Redis. Re-exported here for existing server-side consumers.
import { FREE_DAILY_ANALYSES, ANON_FREE_ANALYSES } from "./plan";
export { FREE_DAILY_ANALYSES, ANON_FREE_ANALYSES };

// ─── Rate limiters ────────────────────────────────────────────────────────────

// Quota is consumed only after an analysis actually succeeds, so a failed
// Groq call never costs the user one of their two daily analyses.
export const analysisRatelimit = new Ratelimit({
  redis: getRedis(),
  limiter: Ratelimit.slidingWindow(FREE_DAILY_ANALYSES, "24 h"),
  analytics: true,
  prefix: "clarity:analysis",
});

// Device/IP-scoped allowance for unauthenticated callers.
export const anonAnalysisRatelimit = new Ratelimit({
  redis: getRedis(),
  limiter: Ratelimit.slidingWindow(Math.max(ANON_FREE_ANALYSES, 1), "24 h"),
  analytics: true,
  prefix: "clarity:analysis:anon",
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

// ─── Helper: get identifier (prefer user ID, fallback to device/IP) ───────────
export function getRatelimitIdentifier(
  req: Request,
  userId?: string | null,
  deviceId?: string | null
): string {
  if (userId) return `user:${userId}`;
  if (deviceId) return `device:${deviceId}`;
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";
  return `ip:${ip}`;
}

// ─── Helper: build 429 response with helpful headers ─────────────────────────
export function rateLimitResponse(reset: number, remaining: number) {
  const retryAfterSeconds = Math.max(1, Math.ceil((reset - Date.now()) / 1000));
  const resetDate = new Date(reset).toISOString();

  return new Response(
    JSON.stringify({
      error: "daily_limit_reached",
      message: `You've used all ${FREE_DAILY_ANALYSES} of your free analyses for today. Your next one unlocks when the day resets.`,
      resetAt: resetDate,
      retryAfterSeconds,
      remaining,
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

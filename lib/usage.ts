import { cookies } from "next/headers";
import { randomUUID } from "crypto";
import {
  analysisRatelimit,
  anonAnalysisRatelimit,
  getRatelimitIdentifier,
  FREE_DAILY_ANALYSES,
  ANON_FREE_ANALYSES,
} from "./ratelimit";

const DEVICE_COOKIE = "clarity_device";
const DEVICE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

/**
 * Master switch for usage limits. Set DISABLE_RATE_LIMIT=true to turn limits
 * off entirely — when off, Redis is never contacted, so the analyze endpoint
 * has no dependency on Upstash being configured.
 */
export const RATE_LIMITING_DISABLED = process.env.DISABLE_RATE_LIMIT === "true";

export interface UsageStatus {
  /** Analyses left in the current window. null when limits are off. */
  remaining: number | null;
  /** Total allowance for this caller. null when limits are off. */
  limit: number | null;
  /** Epoch ms when the window resets. */
  reset: number;
  /** True when the caller has none left. */
  exhausted: boolean;
}

const UNLIMITED: UsageStatus = {
  remaining: null,
  limit: null,
  reset: Date.now(),
  exhausted: false,
};

/**
 * Reads (and lazily issues) the device id used to scope the anonymous
 * allowance. Cookie writes only take effect in route handlers / server
 * actions — a read-only context just gets the existing value.
 */
export async function getDeviceId(): Promise<string> {
  const store = await cookies();
  const existing = store.get(DEVICE_COOKIE)?.value;
  if (existing) return existing;

  const id = randomUUID();
  try {
    store.set(DEVICE_COOKIE, id, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: DEVICE_COOKIE_MAX_AGE,
    });
  } catch {
    // Server Components can't set cookies — the id still works for this request.
  }
  return id;
}

function limiterFor(userId: string | null) {
  return userId ? analysisRatelimit : anonAnalysisRatelimit;
}

function limitFor(userId: string | null): number {
  return userId ? FREE_DAILY_ANALYSES : ANON_FREE_ANALYSES;
}

/**
 * Checks how much quota is left WITHOUT consuming any. Call this before
 * running an analysis so a failed run never costs the user an analysis.
 *
 * If the rate-limit backend is unreachable this fails OPEN: a Redis outage or
 * a missing Upstash credential must never take down the core feature.
 */
export async function checkUsage(
  req: Request,
  userId: string | null,
  deviceId: string | null
): Promise<UsageStatus> {
  if (RATE_LIMITING_DISABLED) return { ...UNLIMITED, reset: Date.now() };

  const limit = limitFor(userId);

  // Anonymous allowance can be switched off entirely.
  if (!userId && limit <= 0) {
    return { remaining: 0, limit: 0, reset: Date.now(), exhausted: true };
  }

  try {
    const identifier = getRatelimitIdentifier(req, userId, deviceId);
    const { remaining, reset } = await limiterFor(userId).getRemaining(identifier);

    // The anon limiter is built with a floor of 1 token, so clamp to the real
    // configured allowance.
    const effectiveRemaining = Math.min(remaining, limit);

    return {
      remaining: Math.max(0, effectiveRemaining),
      limit,
      reset,
      exhausted: effectiveRemaining <= 0,
    };
  } catch (err) {
    console.error("[usage] rate limit backend unavailable, allowing request", err);
    return { ...UNLIMITED, reset: Date.now() };
  }
}

/**
 * Consumes one analysis from the caller's allowance. Call this only AFTER an
 * analysis has completed successfully. Never throws — a bookkeeping failure
 * must not turn a successful analysis into an error for the user.
 */
export async function consumeUsage(
  req: Request,
  userId: string | null,
  deviceId: string | null
): Promise<UsageStatus> {
  if (RATE_LIMITING_DISABLED) return { ...UNLIMITED, reset: Date.now() };

  const limit = limitFor(userId);

  try {
    const identifier = getRatelimitIdentifier(req, userId, deviceId);
    const { remaining, reset } = await limiterFor(userId).limit(identifier);

    return {
      remaining: Math.max(0, Math.min(remaining, limit)),
      limit,
      reset,
      exhausted: remaining <= 0,
    };
  } catch (err) {
    console.error("[usage] could not record usage", err);
    return { ...UNLIMITED, reset: Date.now() };
  }
}

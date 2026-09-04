import { NextRequest, NextResponse } from "next/server";
import { analyzeDecision } from "@/lib/analyze";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import {
  analysisRatelimit,
  getRatelimitIdentifier,
  rateLimitResponse,
} from "@/lib/ratelimit";
import type { AnalyzeRequest } from "@/types";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    // ── 1. Get user session (optional — guests are rate-limited by IP) ──────
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    // ── 2. Rate limiting ─────────────────────────────────────────────────────
    // Authenticated users: limited by user ID (fairer — not by IP which can change)
    // Guest users: limited by IP
    // If the rate limit backend itself is unreachable, fail open rather than
    // taking down the core feature — an outage in Redis shouldn't mean nobody
    // can get an analysis.
    const identifier = getRatelimitIdentifier(req, user?.id ?? null);
    let remaining = -1;
    let reset = Date.now();
    if (process.env.DISABLE_RATE_LIMIT === "true") {
      console.warn("[/api/analyze] rate limiting disabled via DISABLE_RATE_LIMIT env var");
    } else {
      try {
        const result = await analysisRatelimit.limit(identifier);
        if (!result.success) {
          return rateLimitResponse(result.reset, result.remaining);
        }
        remaining = result.remaining;
        reset = result.reset;
      } catch (rateLimitErr) {
        console.error("[/api/analyze] rate limiter unavailable, failing open", rateLimitErr);
      }
    }

    // ── 3. Parse and validate body ────────────────────────────────────────────
    const body = (await req.json()) as AnalyzeRequest;

    if (!body.intake) {
      return NextResponse.json({ error: "Missing intake data" }, { status: 400 });
    }

    const { intake } = body;

    if (!intake.title?.trim() || !intake.description?.trim()) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 }
      );
    }

    if (!intake.options || intake.options.length < 2) {
      return NextResponse.json(
        { error: "At least 2 options are required" },
        { status: 400 }
      );
    }

    for (const opt of intake.options) {
      if (!opt.label?.trim()) {
        return NextResponse.json(
          { error: "All options must have a label" },
          { status: 400 }
        );
      }
    }

    // ── 4. Run AI analysis ────────────────────────────────────────────────────
    const analysis = await analyzeDecision(intake);

    // ── 5. Return with rate limit headers ─────────────────────────────────────
    return NextResponse.json(
      { analysis },
      {
        status: 200,
        headers: {
          "X-RateLimit-Remaining": String(remaining - 1),
          "X-RateLimit-Reset": new Date(reset).toISOString(),
        },
      }
    );
  } catch (err) {
    console.error("[/api/analyze]", err);

    // Groq's own per-minute token cap (not our app's rate limit) — surface
    // this distinctly so the user knows to wait a few seconds rather than
    // reading a generic failure as "something is broken."
    const groqRateLimited = isGroqRateLimitError(err);
    if (groqRateLimited) {
      const retryAfterSeconds = groqRateLimited.retryAfterSeconds ?? 15;
      return NextResponse.json(
        {
          error: "The AI service is briefly at capacity. Please wait a few seconds and try again.",
        },
        {
          status: 503,
          headers: { "Retry-After": String(retryAfterSeconds) },
        }
      );
    }

    return NextResponse.json(
      { error: "Analysis failed. Please try again." },
      { status: 500 }
    );
  }
}

function isGroqRateLimitError(err: unknown): { retryAfterSeconds: number | null } | null {
  if (typeof err !== "object" || err === null) return null;
  const e = err as { status?: number; error?: { error?: { code?: string } }; headers?: Headers };
  const code = e.error?.error?.code;
  const isRateLimit = code === "rate_limit_exceeded" || e.status === 429 || e.status === 413;
  if (!isRateLimit) return null;
  const retryAfterHeader = e.headers?.get?.("retry-after");
  const retryAfterSeconds = retryAfterHeader ? Number(retryAfterHeader) : null;
  return { retryAfterSeconds: Number.isFinite(retryAfterSeconds) ? retryAfterSeconds : null };
}

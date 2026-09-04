import { NextRequest, NextResponse } from "next/server";
import { analyzeDecision } from "@/lib/analyze";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { checkUsage, consumeUsage, getDeviceId } from "@/lib/usage";
import { rateLimitResponse } from "@/lib/ratelimit";
import type { AnalyzeRequest } from "@/types";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    // ── 1. Identify the caller ───────────────────────────────────────────────
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id ?? null;
    const deviceId = await getDeviceId();

    // ── 2. Validate the body before spending anything ────────────────────────
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

    // ── 3. Usage check — never consumes quota here ───────────────────────────
    // An unauthenticated caller with no anonymous allowance left gets a
    // distinct 401 so the client can raise the auth wall rather than showing
    // a generic error.
    const usage = await checkUsage(req, userId, deviceId);

    if (!userId && usage.exhausted) {
      return NextResponse.json(
        {
          error: "auth_required",
          message: "Create a free account to run this analysis.",
        },
        { status: 401 }
      );
    }

    if (usage.exhausted) {
      return rateLimitResponse(usage.reset, 0);
    }

    // ── 4. Run the analysis ──────────────────────────────────────────────────
    const analysis = await analyzeDecision(intake);

    // ── 5. Only a successful analysis costs the user an analysis ─────────────
    const afterUsage = await consumeUsage(req, userId, deviceId);

    return NextResponse.json(
      { analysis, usage: { remaining: afterUsage.remaining, limit: afterUsage.limit } },
      {
        status: 200,
        headers: {
          "X-RateLimit-Remaining": String(afterUsage.remaining),
          "X-RateLimit-Reset": new Date(afterUsage.reset).toISOString(),
        },
      }
    );
  } catch (err) {
    console.error("[/api/analyze]", err);

    // Groq's own per-minute token cap (not the user's quota) — surface it as a
    // transient condition so the user knows to simply retry shortly.
    const groqRateLimited = isGroqRateLimitError(err);
    if (groqRateLimited) {
      return NextResponse.json(
        {
          error: "service_busy",
          message: "Analysis is temporarily unavailable. Please try again shortly.",
        },
        {
          status: 503,
          headers: { "Retry-After": String(groqRateLimited.retryAfterSeconds ?? 15) },
        }
      );
    }

    return NextResponse.json(
      {
        error: "analysis_failed",
        message: "We couldn't complete this analysis. Your decision has not been lost.",
      },
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

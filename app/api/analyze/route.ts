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
    const identifier = getRatelimitIdentifier(req, user?.id ?? null);
    const { success, remaining, reset } = await analysisRatelimit.limit(identifier);

    if (!success) {
      return rateLimitResponse(reset, remaining);
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
    return NextResponse.json(
      { error: "Analysis failed. Please try again." },
      { status: 500 }
    );
  }
}

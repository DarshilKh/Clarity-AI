import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";
import type { TrackOutcomeRequest, OutcomeCheckIn } from "@/types";
import { v4 as uuidv4 } from "uuid";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as TrackOutcomeRequest;

    if (!body.decisionId || !body.daysAfter || !body.actualOutcome) {
      return NextResponse.json(
        { error: "decisionId, daysAfter, and actualOutcome are required" },
        { status: 400 }
      );
    }

    const db = createServerClient();
    const now = new Date().toISOString();

    const checkIn: OutcomeCheckIn = {
      id: uuidv4(),
      decisionId: body.decisionId,
      daysAfter: body.daysAfter,
      satisfactionScore: body.satisfactionScore,
      actualOutcome: body.actualOutcome,
      lessonLearned: body.lessonLearned,
      wouldChooseAgain: body.wouldChooseAgain,
      createdAt: now,
    };

    // Save outcome check-in to its own table
    const { error: checkInError } = await db.from("outcome_check_ins").insert({
      id: checkIn.id,
      decision_id: checkIn.decisionId,
      days_after: checkIn.daysAfter,
      satisfaction_score: checkIn.satisfactionScore,
      actual_outcome: checkIn.actualOutcome,
      lesson_learned: checkIn.lessonLearned,
      would_choose_again: checkIn.wouldChooseAgain,
      created_at: checkIn.createdAt,
    });

    if (checkInError) {
      console.error("[/api/track POST] Supabase error:", checkInError);
      return NextResponse.json({ error: checkInError.message }, { status: 500 });
    }

    // Update decision status to "tracking"
    await db
      .from("decisions")
      .update({ status: "tracking", updated_at: now })
      .eq("id", body.decisionId);

    return NextResponse.json({ checkIn }, { status: 201 });
  } catch (err) {
    console.error("[/api/track POST] error:", err);
    return NextResponse.json({ error: "Failed to save outcome" }, { status: 500 });
  }
}

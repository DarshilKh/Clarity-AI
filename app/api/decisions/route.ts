import { NextRequest, NextResponse } from "next/server";
import { createServerClient, createServerSupabaseClient } from "@/lib/supabase-server";
import type { SaveDecisionRequest, Decision } from "@/types";
import { v4 as uuidv4 } from "uuid";

export const runtime = "nodejs";

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    const db = createServerClient();

    let query = db
      .from("decisions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);

    // Scope to authenticated user, otherwise return nothing
    if (user) {
      query = query.eq("user_id", user.id);
    } else {
      return NextResponse.json({ decisions: [] }, { status: 200 });
    }

    const { data, error } = await query;

    if (error) {
      console.error("[GET /api/decisions]", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const decisions: Decision[] = (data ?? []).map((row) => ({
      id: row.id,
      userId: row.user_id,
      intake: row.intake,
      analysis: row.analysis,
      status: row.status,
      chosenOptionId: row.chosen_option_id,
      chosenReasoning: row.chosen_reasoning,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      outcomes: row.outcomes ?? [],
    }));

    return NextResponse.json({ decisions }, { status: 200 });
  } catch (err) {
    console.error("[GET /api/decisions]", err);
    return NextResponse.json({ error: "Failed to fetch decisions" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as SaveDecisionRequest;

    if (!body.intake || !body.analysis) {
      return NextResponse.json({ error: "Missing intake or analysis" }, { status: 400 });
    }

    const db = createServerClient();
    const now = new Date().toISOString();
    const id = uuidv4();

    const { error } = await db.from("decisions").insert({
      id,
      user_id: user.id,
      intake: body.intake,
      analysis: body.analysis,
      status: "analyzed",
      chosen_option_id: null,
      chosen_reasoning: null,
      created_at: now,
      updated_at: now,
    });

    if (error) {
      console.error("[POST /api/decisions]", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const decision: Decision = {
      id,
      userId: user.id,
      intake: body.intake,
      analysis: body.analysis,
      status: "analyzed",
      chosenOptionId: null,
      chosenReasoning: null,
      createdAt: now,
      updatedAt: now,
      outcomes: [],
    };

    return NextResponse.json({ decision }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/decisions]", err);
    return NextResponse.json({ error: "Failed to save decision" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { createServerClient, createServerSupabaseClient } from "@/lib/supabase-server";

export const runtime = "nodejs";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = createServerClient();
    const { data, error } = await db
      .from("decisions")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Decision not found" }, { status: 404 });
    }

    return NextResponse.json({
      decision: {
        id: data.id,
        userId: data.user_id,
        intake: data.intake,
        analysis: data.analysis,
        status: data.status,
        chosenOptionId: data.chosen_option_id,
        chosenReasoning: data.chosen_reasoning,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        outcomes: data.outcomes ?? [],
      },
    });
  } catch (err) {
    console.error("[GET /api/decisions/[id]]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as {
      chosenOptionId: string;
      reasoning: string;
    };

    if (!body.chosenOptionId) {
      return NextResponse.json({ error: "chosenOptionId is required" }, { status: 400 });
    }

    const db = createServerClient();

    const { error } = await db
      .from("decisions")
      .update({
        chosen_option_id: body.chosenOptionId,
        chosen_reasoning: body.reasoning ?? "",
        status: "decided",
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("user_id", user.id); // can only update own decisions

    if (error) {
      console.error("[PATCH /api/decisions/[id]]", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[PATCH /api/decisions/[id]]", err);
    return NextResponse.json({ error: "Failed to record choice" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { checkUsage, getDeviceId } from "@/lib/usage";

export const runtime = "nodejs";

// Read-only view of the caller's remaining analyses — never consumes quota.
export async function GET(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id ?? null;
    const deviceId = await getDeviceId();

    const usage = await checkUsage(req, userId, deviceId);

    return NextResponse.json({
      authenticated: Boolean(userId),
      remaining: usage.remaining,
      limit: usage.limit,
      resetAt: new Date(usage.reset).toISOString(),
    });
  } catch (err) {
    console.error("[/api/usage]", err);
    // Usage display is non-critical — never block the UI on it.
    return NextResponse.json({ authenticated: false, remaining: null, limit: null }, { status: 200 });
  }
}

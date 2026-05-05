import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export const runtime = "nodejs";

// Supabase redirects here after:
// - OAuth login (Google, GitHub)
// - Email confirmation
// - Password reset link click
export async function GET(req: NextRequest) {
  const { searchParams, origin } = req.nextUrl;
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  // Handle OAuth/email errors from Supabase
  if (error) {
    const errorUrl = new URL("/auth/login", origin);
    errorUrl.searchParams.set("error", errorDescription ?? error);
    return NextResponse.redirect(errorUrl);
  }

  if (code) {
    const supabase = await createServerSupabaseClient();
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (!exchangeError) {
      // Successful auth — go to intended destination or dashboard
      const redirectUrl = new URL(next.startsWith("/") ? next : "/dashboard", origin);
      return NextResponse.redirect(redirectUrl);
    }

    // Exchange failed
    const errorUrl = new URL("/auth/login", origin);
    errorUrl.searchParams.set("error", "Authentication failed. Please try again.");
    return NextResponse.redirect(errorUrl);
  }

  // No code — shouldn't happen, go home
  return NextResponse.redirect(new URL("/", origin));
}

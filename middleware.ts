import { NextRequest, NextResponse } from "next/server";
import { createMiddlewareSupabaseClient } from "@/lib/supabase-middleware";

// Routes that require the user to be logged in.
// Note: /decision/new is deliberately public — a visitor can compose a whole
// decision before being asked to create an account (the auth wall sits at
// Analyze). Saved decisions at /decision/[id] still require auth.
const PROTECTED_ROUTES = ["/dashboard", "/decision", "/journal"];
const PUBLIC_EXCEPTIONS = ["/decision/new"];

// Routes only for guests (redirect logged-in users away)
const AUTH_ROUTES = ["/auth/login", "/auth/signup", "/auth/forgot-password"];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const { pathname } = req.nextUrl;

  // Create SSR-compatible Supabase client that reads from cookies
  const supabase = createMiddlewareSupabaseClient(req, res);

  // Refresh session — this is the key call that keeps auth alive
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const isAuthenticated = !!session;

  const isPublicException = PUBLIC_EXCEPTIONS.some((r) => pathname.startsWith(r));

  // Redirect unauthenticated users away from protected routes
  if (
    !isAuthenticated &&
    !isPublicException &&
    PROTECTED_ROUTES.some((r) => pathname.startsWith(r))
  ) {
    const loginUrl = new URL("/auth/login", req.url);
    loginUrl.searchParams.set("next", pathname); // preserve intended destination
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from auth pages, honouring an intended
  // destination so a pending analysis resumes instead of dumping them on the
  // dashboard.
  if (isAuthenticated && AUTH_ROUTES.some((r) => pathname.startsWith(r))) {
    const next = req.nextUrl.searchParams.get("next");
    const destination = next && next.startsWith("/") ? next : "/dashboard";
    return NextResponse.redirect(new URL(destination, req.url));
  }

  return res;
}

export const config = {
  matcher: [
    // Match all routes except static files, images, and Next.js internals
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

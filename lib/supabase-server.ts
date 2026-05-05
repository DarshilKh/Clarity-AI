// SERVER-ONLY — never import this in a "use client" file.
// It uses next/headers which is only available in Server Components
// and Route Handlers (app directory).

import { createServerClient as createSSRClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// ─── Server Component / Route Handler client ──────────────────────────────────
// Reads the session from cookies — use in route.ts handlers and Server Components.
export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createSSRClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Server Components cannot set cookies — ignore safely
        }
      },
    },
  });
}

// ─── Service role client ──────────────────────────────────────────────────────
// Bypasses Row Level Security entirely.
// Use ONLY in route.ts files (never in the browser).
export function createServerClient() {
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false },
  });
}

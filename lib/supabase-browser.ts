"use client";

import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Returns a new browser client each call.
// Safe to use in any "use client" component.
// Never imports next/headers — no server-only APIs.
export function createBrowserSupabaseClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

// Legacy named export kept so any old import still works
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

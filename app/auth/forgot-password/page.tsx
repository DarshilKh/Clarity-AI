"use client";

import { useState } from "react";
import Link from "next/link";
import { createBrowserSupabaseClient } from "@/lib/supabase-browser";
import { Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail]   = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone]     = useState(false);
  const [error, setError]   = useState<string | null>(null);

  const supabase = createBrowserSupabaseClient();

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email.trim(),
      {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      }
    );

    if (resetError) {
      setError(resetError.message);
      setLoading(false);
      return;
    }

    setDone(true);
    setLoading(false);
  }

  if (done) {
    return (
      <div
        style={{
          background: "var(--color-surface-raised)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-xl)",
          padding: "clamp(1.5rem, 5vw, 2.5rem)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "var(--radius-full)",
            background: "var(--color-sage-pale)",
            border: "2px solid var(--color-sage-border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.25rem",
          }}
        >
          <CheckCircle2 size={26} color="var(--color-sage)" strokeWidth={2} />
        </div>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.5rem",
            fontWeight: 800,
            color: "var(--color-ink)",
            marginBottom: "0.6rem",
          }}
        >
          Reset link sent
        </h2>
        <p style={{ fontSize: "0.9rem", color: "var(--color-ink-muted)", lineHeight: 1.65, marginBottom: "1.5rem" }}>
          If <strong style={{ fontWeight: 600, color: "var(--color-ink)" }}>{email}</strong> has an account,
          you&apos;ll receive a password reset link within a few minutes.
        </p>
        <p style={{ fontSize: "0.78rem", color: "var(--color-ink-faint)" }}>
          Didn&apos;t get it? Check spam, or{" "}
          <button
            onClick={() => { setDone(false); setEmail(""); }}
            style={{ background: "none", border: "none", color: "var(--color-amber)", fontWeight: 600, cursor: "pointer", fontSize: "0.78rem" }}
          >
            try again
          </button>
        </p>
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          background: "var(--color-surface-raised)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-xl)",
          padding: "clamp(1.5rem, 5vw, 2.5rem)",
        }}
      >
        <Link
          href="/auth/login"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.375rem",
            fontSize: "0.82rem",
            color: "var(--color-ink-muted)",
            textDecoration: "none",
            marginBottom: "1.5rem",
            fontWeight: 500,
          }}
        >
          <ArrowLeft size={14} /> Back to sign in
        </Link>

        <div style={{ marginBottom: "1.75rem" }}>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.4rem, 4vw, 1.8rem)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: "var(--color-ink)",
              marginBottom: "0.4rem",
            }}
          >
            Reset your password
          </h1>
          <p style={{ fontSize: "0.9rem", color: "var(--color-ink-muted)" }}>
            Enter your email and we&apos;ll send you a reset link.
          </p>
        </div>

        {error && (
          <div
            style={{
              background: "var(--color-rose-pale)",
              border: "1px solid var(--color-rose-border)",
              borderRadius: "var(--radius-md)",
              padding: "0.75rem 1rem",
              fontSize: "0.85rem",
              color: "var(--color-rose)",
              marginBottom: "1.25rem",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleReset} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label htmlFor="email" style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "var(--color-ink)", marginBottom: "0.35rem" }}>
              Email address
            </label>
            <input
              id="email"
              type="email"
              className="input-field"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "0.8rem",
              background: "var(--color-ink)",
              color: "white",
              border: "none",
              borderRadius: "var(--radius-md)",
              fontWeight: 600,
              fontSize: "0.95rem",
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? (
              <><Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> Sending…</>
            ) : (
              "Send reset link"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

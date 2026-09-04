"use client";

import { useState } from "react";
import Link from "next/link";
import { createBrowserSupabaseClient } from "@/lib/supabase-browser";
import { Loader2, ChevronLeft, Mail } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createBrowserSupabaseClient();

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

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
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--color-border)",
            background: "var(--color-surface-alt)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.25rem",
          }}
        >
          <Mail size={19} color="var(--color-ink-muted)" strokeWidth={1.75} />
        </div>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.5rem",
            fontWeight: 600,
            letterSpacing: "-0.03em",
            color: "var(--color-ink)",
            marginBottom: "0.6rem",
          }}
        >
          Check your email
        </h1>
        <p
          style={{
            fontSize: "var(--text-sm)",
            color: "var(--color-ink-muted)",
            lineHeight: 1.65,
            marginBottom: "1.5rem",
          }}
        >
          If an account exists for <strong style={{ color: "var(--color-ink)" }}>{email}</strong>,
          a password reset link is on its way.
        </p>
        <Link href="/auth/login" className="btn btn-ghost">
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link
        href="/auth/login"
        className="link-quiet"
        style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", fontSize: "var(--text-xs)", marginBottom: "1.25rem" }}
      >
        <ChevronLeft size={14} />
        Back to sign in
      </Link>

      <div style={{ marginBottom: "1.75rem" }}>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.65rem",
            fontWeight: 600,
            letterSpacing: "-0.03em",
            color: "var(--color-ink)",
            marginBottom: "0.4rem",
          }}
        >
          Reset your password
        </h1>
        <p style={{ fontSize: "var(--text-sm)", color: "var(--color-ink-muted)", lineHeight: 1.6 }}>
          Enter your email and we&apos;ll send you a link to set a new one.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          style={{
            background: "var(--color-rose-pale)",
            border: "1px solid var(--color-rose-border)",
            borderRadius: "var(--radius-md)",
            padding: "0.75rem 0.95rem",
            fontSize: "var(--text-sm)",
            color: "var(--color-rose)",
            marginBottom: "1.25rem",
            lineHeight: 1.55,
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleReset} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div>
          <label htmlFor="email" className="field-label">
            Email
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

        <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: "100%" }}>
          {loading ? (
            <>
              <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
              Sending…
            </>
          ) : (
            "Send reset link"
          )}
        </button>
      </form>
    </div>
  );
}

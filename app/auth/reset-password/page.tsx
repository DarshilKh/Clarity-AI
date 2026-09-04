"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase-browser";
import { Eye, EyeOff, Loader2, Check } from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createBrowserSupabaseClient();

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Those passwords don't match.");
      return;
    }

    setLoading(true);

    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    setDone(true);
    setTimeout(() => router.push("/dashboard"), 2000);
  }

  if (done) {
    return (
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--color-sage-border)",
            background: "var(--color-sage-pale)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.25rem",
          }}
        >
          <Check size={19} color="var(--color-sage)" strokeWidth={2.5} />
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
          Password updated
        </h1>
        <p style={{ fontSize: "var(--text-sm)", color: "var(--color-ink-muted)", lineHeight: 1.65 }}>
          Taking you to your dashboard…
        </p>
      </div>
    );
  }

  return (
    <div>
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
          Set a new password
        </h1>
        <p style={{ fontSize: "var(--text-sm)", color: "var(--color-ink-muted)", lineHeight: 1.6 }}>
          Choose a password you haven&apos;t used before.
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
          <label htmlFor="password" className="field-label">
            New password
          </label>
          <div style={{ position: "relative" }}>
            <input
              id="password"
              type={showPw ? "text" : "password"}
              className="input-field"
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              style={{ paddingRight: "2.75rem" }}
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              aria-label={showPw ? "Hide password" : "Show password"}
              style={{
                position: "absolute",
                right: "0.75rem",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--color-ink-faint)",
                display: "flex",
              }}
            >
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="confirm" className="field-label">
            Confirm password
          </label>
          <input
            id="confirm"
            type={showPw ? "text" : "password"}
            className="input-field"
            placeholder="Re-enter your password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            autoComplete="new-password"
          />
        </div>

        <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: "100%" }}>
          {loading ? (
            <>
              <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
              Updating…
            </>
          ) : (
            "Update password"
          )}
        </button>
      </form>
    </div>
  );
}

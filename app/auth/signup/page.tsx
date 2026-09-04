"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { createBrowserSupabaseClient } from "@/lib/supabase-browser";
import { Eye, EyeOff, Loader2, Check, Mail } from "lucide-react";

const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "8+ characters", ok: password.length >= 8 },
    { label: "Uppercase letter", ok: /[A-Z]/.test(password) },
    { label: "Number", ok: /\d/.test(password) },
  ];
  const score = checks.filter((c) => c.ok).length;
  if (!password) return null;

  const tone =
    score === 3 ? "var(--color-sage)" : score === 2 ? "var(--color-amber)" : "var(--color-rose)";

  return (
    <div style={{ marginTop: "0.6rem" }}>
      <div style={{ display: "flex", gap: "0.2rem", marginBottom: "0.45rem" }} aria-hidden>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{
              flex: 1,
              height: 2,
              borderRadius: 1,
              background: i < score ? tone : "var(--color-border)",
              transition: "background 0.2s ease",
            }}
          />
        ))}
      </div>
      <div style={{ display: "flex", gap: "0.85rem", flexWrap: "wrap" }}>
        {checks.map((c) => (
          <span
            key={c.label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
              fontSize: "var(--text-micro)",
              color: c.ok ? "var(--color-sage)" : "var(--color-ink-faint)",
            }}
          >
            <Check size={11} strokeWidth={3} style={{ opacity: c.ok ? 1 : 0.35 }} />
            {c.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function SignupForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/dashboard";
  const resumingDecision = next.startsWith("/decision/new");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const supabase = createBrowserSupabaseClient();

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const normalizedEmail = email.trim().toLowerCase();

    if (!isValidEmail(normalizedEmail)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      setLoading(false);
      return;
    }

    const { error: signUpError } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: {
        data: { full_name: name.trim() },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });

    if (signUpError) {
      const msg = signUpError.message.toLowerCase();
      if (msg.includes("already registered") || msg.includes("already exists")) {
        setError("An account with this email already exists — try signing in instead.");
      } else if (msg.includes("invalid email")) {
        setError("That email address wasn't accepted. Please try a different one.");
      } else {
        setError(signUpError.message);
      }
      setLoading(false);
      return;
    }

    setDone(true);
    setLoading(false);
  }

  async function handleGoogleSignIn() {
    setOauthLoading(true);
    setError(null);

    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        queryParams: { access_type: "offline", prompt: "consent" },
      },
    });

    if (oauthError) {
      setError("Sign-up was not completed. Your decision is still here.");
      setOauthLoading(false);
    }
  }

  // ── Confirmation screen ───────────────────────────────────────────────────
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
          Confirm your email
        </h1>
        <p
          style={{
            fontSize: "var(--text-sm)",
            color: "var(--color-ink-muted)",
            lineHeight: 1.65,
            marginBottom: "1.5rem",
          }}
        >
          We sent a confirmation link to <strong style={{ color: "var(--color-ink)" }}>{email}</strong>.
          Open it and you&apos;ll come straight back
          {resumingDecision ? " to your decision." : " to Clarity."}
        </p>
        <Link href="/auth/login" className="btn btn-ghost">
          Back to sign in
        </Link>
      </div>
    );
  }

  const authHref = (path: string) => `${path}?next=${encodeURIComponent(next)}`;

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
          Create your account
        </h1>
        <p style={{ fontSize: "var(--text-sm)", color: "var(--color-ink-muted)", lineHeight: 1.6 }}>
          Free to use — 2 analyses per day, no card required.
        </p>
      </div>

      {resumingDecision && (
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "0.55rem",
            padding: "0.75rem 0.95rem",
            borderRadius: "var(--radius-md)",
            background: "var(--color-surface-alt)",
            border: "1px solid var(--color-border)",
            marginBottom: "1.25rem",
          }}
        >
          <Check size={14} color="var(--color-sage)" strokeWidth={2.5} style={{ flexShrink: 0, marginTop: 3 }} />
          <p style={{ fontSize: "var(--text-xs)", color: "var(--color-ink-muted)", lineHeight: 1.55 }}>
            Your decision is saved — your analysis runs as soon as your account is ready.
          </p>
        </div>
      )}

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

      <button
        onClick={handleGoogleSignIn}
        disabled={oauthLoading || loading}
        className="btn btn-ghost"
        style={{ width: "100%", background: "var(--color-surface-raised)" }}
      >
        {oauthLoading ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> : <GoogleIcon />}
        Continue with Google
      </button>

      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", margin: "1.25rem 0" }}>
        <span style={{ flex: 1, height: 1, background: "var(--color-border)" }} />
        <span className="meta">or</span>
        <span style={{ flex: 1, height: 1, background: "var(--color-border)" }} />
      </div>

      <form onSubmit={handleSignup} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div>
          <label htmlFor="name" className="field-label">
            Name <span className="optional">— optional</span>
          </label>
          <input
            id="name"
            className="input-field"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
          />
        </div>

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

        <div>
          <label htmlFor="password" className="field-label">
            Password
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
          <PasswordStrength password={password} />
        </div>

        <button type="submit" disabled={loading || oauthLoading} className="btn btn-primary" style={{ width: "100%" }}>
          {loading ? (
            <>
              <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
              Creating account…
            </>
          ) : (
            "Create account"
          )}
        </button>
      </form>

      <p
        style={{
          textAlign: "center",
          fontSize: "var(--text-sm)",
          color: "var(--color-ink-muted)",
          marginTop: "1.5rem",
        }}
      >
        Already have an account?{" "}
        <Link href={authHref("/auth/login")} style={{ color: "var(--color-ink)", fontWeight: 600 }}>
          Sign in
        </Link>
      </p>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div style={{ display: "flex", justifyContent: "center", padding: "3rem" }}>
          <Loader2 size={20} style={{ animation: "spin 1s linear infinite" }} color="var(--color-ink-faint)" />
        </div>
      }
    >
      <SignupForm />
    </Suspense>
  );
}

"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createBrowserSupabaseClient } from "@/lib/supabase-browser";
import { Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";

// ── Inline SVG brand icons ───────────────────────────────────────────────────

const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

const GithubIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

// ── Email validator ──────────────────────────────────────────────────────────
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ── Password strength component ──────────────────────────────────────────────
function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "8+ characters",    ok: password.length >= 8 },
    { label: "Uppercase letter", ok: /[A-Z]/.test(password) },
    { label: "Number",           ok: /\d/.test(password) },
  ];
  const score = checks.filter((c) => c.ok).length;

  if (!password) return null;

  return (
    <div style={{ marginTop: "0.5rem" }}>
      <div style={{ display: "flex", gap: "0.25rem", marginBottom: "0.4rem" }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: 3,
              borderRadius: 2,
              background:
                i < score
                  ? score === 1
                    ? "var(--color-rose)"
                    : score === 2
                    ? "var(--color-amber)"
                    : "var(--color-sage)"
                  : "var(--color-border)",
              transition: "background 0.2s ease",
            }}
          />
        ))}
      </div>
      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
        {checks.map((c) => (
          <div key={c.label} style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
            <CheckCircle2
              size={11}
              color={c.ok ? "var(--color-sage)" : "var(--color-border-strong)"}
              strokeWidth={2.5}
            />
            <span
              style={{
                fontSize: "0.7rem",
                color: c.ok ? "var(--color-sage)" : "var(--color-ink-faint)",
              }}
            >
              {c.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Inner component (uses useSearchParams) ───────────────────────────────────
function SignupForm() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const next         = searchParams.get("next") ?? "/dashboard";

  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [oauthLoading, setOauthLoading] = useState<"google" | "github" | null>(null);
  const [error, setError]       = useState<string | null>(null);
  const [done, setDone]         = useState(false);

  const supabase = createBrowserSupabaseClient();

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const normalizedEmail = email.trim().toLowerCase();

    if (!isValidEmail(normalizedEmail)) {
      setError("Please enter a valid email address (e.g. you@example.com).");
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
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${next}`,
      },
    });

    if (signUpError) {
      const msg = signUpError.message.toLowerCase();
      if (msg.includes("already registered") || msg.includes("already exists")) {
        setError("An account with this email already exists. Try signing in instead.");
      } else if (msg.includes("invalid email")) {
        setError("This email address is not accepted. Please use a different email.");
      } else {
        setError(signUpError.message);
      }
      setLoading(false);
      return;
    }

    setDone(true);
    setLoading(false);
  }

  async function handleOAuth(provider: "google" | "github") {
    setOauthLoading(provider);
    setError(null);

    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${next}`,
        queryParams: { access_type: "offline", prompt: "consent" },
      },
    });

    if (oauthError) {
      setError(oauthError.message);
      setOauthLoading(null);
    }
  }

  // ── Email-sent confirmation screen ────────────────────────────────────────
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
          Check your email
        </h2>

        <p
          style={{
            fontSize: "0.9rem",
            color: "var(--color-ink-muted)",
            lineHeight: 1.65,
            marginBottom: "1.5rem",
          }}
        >
          We sent a confirmation link to{" "}
          <strong style={{ fontWeight: 600, color: "var(--color-ink)" }}>
            {email.trim().toLowerCase()}
          </strong>
          . Click it to activate your account.
        </p>

        <p style={{ fontSize: "0.78rem", color: "var(--color-ink-faint)" }}>
          Already confirmed?{" "}
          <Link href="/auth/login" style={{ color: "var(--color-amber)", fontWeight: 600 }}>
            Sign in
          </Link>
        </p>
      </div>
    );
  }

  // ── Main signup form ───────────────────────────────────────────────────────
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
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.5rem, 4vw, 1.9rem)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: "var(--color-ink)",
              marginBottom: "0.4rem",
            }}
          >
            Start thinking clearly
          </h1>
          <p style={{ fontSize: "0.9rem", color: "var(--color-ink-muted)" }}>
            Free forever. 2 AI analyses per day.
          </p>
        </div>

        {/* Error banner */}
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
              lineHeight: 1.5,
            }}
          >
            {error}
          </div>
        )}

        {/* OAuth buttons */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.625rem",
            marginBottom: "1.5rem",
          }}
        >
          {/* Google */}
          <button
            onClick={() => handleOAuth("google")}
            disabled={!!oauthLoading || loading}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.625rem",
              width: "100%",
              padding: "0.75rem",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--color-border)",
              background: "var(--color-surface-raised)",
              color: "var(--color-ink)",
              fontWeight: 500,
              fontSize: "0.9rem",
              cursor: oauthLoading || loading ? "not-allowed" : "pointer",
              opacity: oauthLoading === "github" ? 0.5 : 1,
              transition: "all 0.15s ease",
            }}
          >
            {oauthLoading === "google" ? (
              <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
            ) : (
              <GoogleIcon />
            )}
            Continue with Google
          </button>

          {/* GitHub */}
          <button
            onClick={() => handleOAuth("github")}
            disabled={!!oauthLoading || loading}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.625rem",
              width: "100%",
              padding: "0.75rem",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--color-border)",
              background: "var(--color-ink)",
              color: "white",
              fontWeight: 500,
              fontSize: "0.9rem",
              cursor: oauthLoading || loading ? "not-allowed" : "pointer",
              opacity: oauthLoading === "google" ? 0.5 : 1,
              transition: "all 0.15s ease",
            }}
          >
            {oauthLoading === "github" ? (
              <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
            ) : (
              <GithubIcon />
            )}
            Continue with GitHub
          </button>
        </div>

        {/* Divider */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            marginBottom: "1.5rem",
          }}
        >
          <div style={{ flex: 1, height: 1, background: "var(--color-border)" }} />
          <span
            style={{
              fontSize: "0.78rem",
              color: "var(--color-ink-faint)",
              whiteSpace: "nowrap",
            }}
          >
            or sign up with email
          </span>
          <div style={{ flex: 1, height: 1, background: "var(--color-border)" }} />
        </div>

        {/* Form */}
        <form
          onSubmit={handleSignup}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          {/* Full name */}
          <div>
            <label
              htmlFor="name"
              style={{
                display: "block",
                fontSize: "0.82rem",
                fontWeight: 600,
                color: "var(--color-ink)",
                marginBottom: "0.35rem",
              }}
            >
              Full name
            </label>
            <input
              id="name"
              type="text"
              className="input-field"
              placeholder="Alex Kumar"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              style={{
                display: "block",
                fontSize: "0.82rem",
                fontWeight: 600,
                color: "var(--color-ink)",
                marginBottom: "0.35rem",
              }}
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              className="input-field"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value.toLowerCase())}
              required
              autoComplete="email"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              style={{
                display: "block",
                fontSize: "0.82rem",
                fontWeight: 600,
                color: "var(--color-ink)",
                marginBottom: "0.35rem",
              }}
            >
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                id="password"
                type={showPw ? "text" : "password"}
                className="input-field"
                placeholder="Min 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                style={{ paddingRight: "2.75rem" }}
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
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
                  alignItems: "center",
                }}
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <PasswordStrength password={password} />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !!oauthLoading}
            style={{
              width: "100%",
              padding: "0.8rem",
              background: "var(--color-amber)",
              color: "white",
              border: "none",
              borderRadius: "var(--radius-md)",
              fontWeight: 600,
              fontSize: "0.95rem",
              cursor: loading || oauthLoading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              opacity: loading || oauthLoading ? 0.7 : 1,
              marginTop: "0.25rem",
              transition: "opacity 0.15s ease",
            }}
          >
            {loading ? (
              <>
                <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
                Creating account…
              </>
            ) : (
              "Create free account"
            )}
          </button>
        </form>

        {/* Sign in link */}
        <p
          style={{
            textAlign: "center",
            fontSize: "0.85rem",
            color: "var(--color-ink-muted)",
            marginTop: "1.5rem",
          }}
        >
          Already have an account?{" "}
          <Link
            href="/auth/login"
            style={{
              color: "var(--color-amber)",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

// ✅ Default export — wraps SignupForm in Suspense
export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div style={{ display: "flex", justifyContent: "center", padding: "4rem" }}>
          <Loader2 size={24} style={{ animation: "spin 1s linear infinite" }} />
        </div>
      }
    >
      <SignupForm />
    </Suspense>
  );
}
"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createBrowserSupabaseClient } from "@/lib/supabase-browser";
import { Eye, EyeOff, Loader2 } from "lucide-react";

// ── Google brand icon ────────────────────────────────────────────────────────
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

// ────────────────────────────────────────────────────────────────────────────

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/dashboard";
  const urlError = searchParams.get("error");

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);
  const [error, setError]       = useState<string | null>(urlError);
  const [success]               = useState<string | null>(null);

  const supabase = createBrowserSupabaseClient();

  useEffect(() => {
    if (urlError) setError(urlError);
  }, [urlError]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError) {
      setError(
        signInError.message === "Invalid login credentials"
          ? "Incorrect email or password. Try again or reset your password."
          : signInError.message
      );
      setLoading(false);
      return;
    }

    router.push(next);
    router.refresh();
  }

  async function handleGoogleSignIn() {
    setOauthLoading(true);
    setError(null);

    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${next}`,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });

    if (oauthError) {
      setError(oauthError.message);
      setOauthLoading(false);
    }
  }

  return (
    <div>
      {/* Card */}
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
            Welcome back
          </h1>
          <p style={{ fontSize: "0.9rem", color: "var(--color-ink-muted)" }}>
            Sign in to your Clarity account
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
            }}
          >
            {error}
          </div>
        )}

        {/* Success banner */}
        {success && (
          <div
            style={{
              background: "var(--color-sage-pale)",
              border: "1px solid var(--color-sage-border)",
              borderRadius: "var(--radius-md)",
              padding: "0.75rem 1rem",
              fontSize: "0.85rem",
              color: "var(--color-sage)",
              marginBottom: "1.25rem",
            }}
          >
            {success}
          </div>
        )}

        {/* Google OAuth Button */}
        <div style={{ marginBottom: "1.5rem" }}>
          <button
            onClick={handleGoogleSignIn}
            disabled={oauthLoading || loading}
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
              opacity: oauthLoading || loading ? 0.7 : 1,
              transition: "all 0.15s ease",
            }}
          >
            {oauthLoading ? (
              <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
            ) : (
              <GoogleIcon />
            )}
            Continue with Google
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
            or sign in with email
          </span>
          <div style={{ flex: 1, height: 1, background: "var(--color-border)" }} />
        </div>

        {/* Email / password form */}
        <form
          onSubmit={handleLogin}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
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
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          {/* Password */}
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                marginBottom: "0.35rem",
              }}
            >
              <label
                htmlFor="password"
                style={{
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  color: "var(--color-ink)",
                }}
              >
                Password
              </label>
              <Link
                href="/auth/forgot-password"
                style={{
                  fontSize: "0.78rem",
                  color: "var(--color-amber)",
                  textDecoration: "none",
                  fontWeight: 500,
                }}
              >
                Forgot password?
              </Link>
            </div>

            <div style={{ position: "relative" }}>
              <input
                id="password"
                type={showPw ? "text" : "password"}
                className="input-field"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
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
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || oauthLoading}
            style={{
              width: "100%",
              padding: "0.8rem",
              background: loading ? "var(--color-ink-muted)" : "var(--color-amber)",
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
              transition: "background 0.15s ease",
              marginTop: "0.25rem",
            }}
          >
            {loading ? (
              <>
                <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
                Signing in…
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        {/* Sign up link */}
        <p
          style={{
            textAlign: "center",
            fontSize: "0.85rem",
            color: "var(--color-ink-muted)",
            marginTop: "1.5rem",
          }}
        >
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/signup"
            style={{
              color: "var(--color-amber)",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Sign up free
          </Link>
        </p>
      </div>

      {/* Free tier note */}
      <p
        style={{
          textAlign: "center",
          fontSize: "0.78rem",
          color: "var(--color-ink-faint)",
          marginTop: "1.25rem",
        }}
      >
        Free plan includes 2 AI analyses per day
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div style={{ display: "flex", justifyContent: "center", padding: "4rem" }}>
          <Loader2 size={24} style={{ animation: "spin 1s linear infinite" }} />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
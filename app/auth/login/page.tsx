"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createBrowserSupabaseClient } from "@/lib/supabase-browser";
import { Eye, EyeOff, Loader2, Check } from "lucide-react";

const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/dashboard";
  const resumingDecision = next.startsWith("/decision/new");
  const urlError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);
  const [error, setError] = useState<string | null>(urlError);

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
          ? "That email and password don't match. Try again, or reset your password."
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
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        queryParams: { access_type: "offline", prompt: "consent" },
      },
    });

    if (oauthError) {
      setError("Sign-in was not completed. Your decision is still here.");
      setOauthLoading(false);
    }
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
          Welcome back
        </h1>
        <p style={{ fontSize: "var(--text-sm)", color: "var(--color-ink-muted)", lineHeight: 1.6 }}>
          Sign in to reach your decisions and journal.
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
            Your decision is saved — you&apos;ll return to it as soon as you sign in.
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

      <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
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
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <label htmlFor="password" className="field-label">
              Password
            </label>
            <Link href="/auth/forgot-password" className="link-quiet" style={{ fontSize: "var(--text-xs)" }}>
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

        <button type="submit" disabled={loading || oauthLoading} className="btn btn-primary" style={{ width: "100%" }}>
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

      <p
        style={{
          textAlign: "center",
          fontSize: "var(--text-sm)",
          color: "var(--color-ink-muted)",
          marginTop: "1.5rem",
        }}
      >
        New to Clarity?{" "}
        <Link href={authHref("/auth/signup")} style={{ color: "var(--color-ink)", fontWeight: 600 }}>
          Create an account
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div style={{ display: "flex", justifyContent: "center", padding: "3rem" }}>
          <Loader2 size={20} style={{ animation: "spin 1s linear infinite" }} color="var(--color-ink-faint)" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}

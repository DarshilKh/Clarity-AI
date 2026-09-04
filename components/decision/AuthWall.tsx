"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createBrowserSupabaseClient } from "@/lib/supabase-browser";
import { Check, Loader2, Mail, X } from "lucide-react";

const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

interface Props {
  open: boolean;
  onClose: () => void;
  /** Where to land after auth so the pending analysis resumes. */
  returnTo: string;
  /** Short summary of the decision being held, for reassurance. */
  decisionTitle?: string;
}

export default function AuthWall({ open, onClose, returnTo, decisionTitle }: Props) {
  const supabase = createBrowserSupabaseClient();
  const [oauthLoading, setOauthLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Close on Escape; lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  async function continueWithGoogle() {
    setOauthLoading(true);
    setError(null);
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(returnTo)}`,
      },
    });
    if (oauthError) {
      setError("Sign-in was not completed. Your decision is still here.");
      setOauthLoading(false);
    }
  }

  const authHref = (path: string) => `${path}?next=${encodeURIComponent(returnTo)}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="authwall-title"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        background: "rgba(13, 13, 13, 0.45)",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 440,
          background: "var(--color-surface-raised)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-xl)",
          overflow: "hidden",
          boxShadow: "0 24px 60px rgba(13,13,13,0.22)",
          animation: "fadeIn 0.22s ease both",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "1.5rem 1.5rem 1.25rem",
            borderBottom: "1px solid var(--color-border)",
            position: "relative",
          }}
        >
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              position: "absolute",
              top: "1rem",
              right: "1rem",
              background: "transparent",
              border: "none",
              color: "var(--color-ink-faint)",
              cursor: "pointer",
              padding: 4,
              display: "flex",
            }}
          >
            <X size={16} />
          </button>

          <h2
            id="authwall-title"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.4rem",
              fontWeight: 600,
              letterSpacing: "-0.025em",
              color: "var(--color-ink)",
              marginBottom: "0.5rem",
              paddingRight: "2rem",
            }}
          >
            Your decision is ready to analyze.
          </h2>
          <p style={{ fontSize: "0.9rem", color: "var(--color-ink-muted)", lineHeight: 1.6 }}>
            Create a free account to run the analysis and keep it in your journal.
          </p>
        </div>

        {/* Reassurance */}
        <div
          style={{
            padding: "0.85rem 1.5rem",
            background: "var(--color-surface-alt)",
            borderBottom: "1px solid var(--color-border)",
            display: "flex",
            alignItems: "flex-start",
            gap: "0.55rem",
          }}
        >
          <Check size={14} color="var(--color-sage)" strokeWidth={2.5} style={{ flexShrink: 0, marginTop: 3 }} />
          <p style={{ fontSize: "0.82rem", color: "var(--color-ink-muted)", lineHeight: 1.55 }}>
            {decisionTitle ? (
              <>
                &ldquo;{decisionTitle}&rdquo; is saved. Nothing you&apos;ve written will be lost.
              </>
            ) : (
              <>Everything you&apos;ve written is saved. You won&apos;t need to re-enter it.</>
            )}
          </p>
        </div>

        {/* Actions */}
        <div style={{ padding: "1.25rem 1.5rem 1.5rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          {error && (
            <div
              style={{
                background: "var(--color-rose-pale)",
                border: "1px solid var(--color-rose-border)",
                borderRadius: "var(--radius-md)",
                padding: "0.65rem 0.9rem",
                fontSize: "0.82rem",
                color: "var(--color-rose)",
                marginBottom: "0.25rem",
              }}
            >
              {error}
            </div>
          )}

          <button
            onClick={continueWithGoogle}
            disabled={oauthLoading}
            className="btn btn-ghost"
            style={{ width: "100%", justifyContent: "center" }}
          >
            {oauthLoading ? (
              <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
            ) : (
              <GoogleIcon />
            )}
            Continue with Google
          </button>

          <Link href={authHref("/auth/signup")} className="btn btn-primary" style={{ width: "100%" }}>
            <Mail size={15} />
            Continue with email
          </Link>

          <p
            style={{
              textAlign: "center",
              fontSize: "0.82rem",
              color: "var(--color-ink-muted)",
              marginTop: "0.4rem",
            }}
          >
            Already have an account?{" "}
            <Link href={authHref("/auth/login")} style={{ color: "var(--color-ink)", fontWeight: 600 }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

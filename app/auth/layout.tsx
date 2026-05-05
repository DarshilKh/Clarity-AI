import type { Metadata } from "next";
import Link from "next/link";
import { Brain } from "lucide-react";

export const metadata: Metadata = {
  title: "Clarity — Sign in",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "var(--color-surface)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Minimal header */}
      <header
        style={{
          padding: "1.25rem 1.5rem",
          borderBottom: "1px solid var(--color-border)",
          background: "var(--color-surface-raised)",
        }}
      >
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            textDecoration: "none",
          }}
        >
          <div
            style={{
              width: 30,
              height: 30,
              background: "var(--color-ink)",
              borderRadius: "var(--radius-sm)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Brain size={16} color="white" strokeWidth={1.8} />
          </div>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.1rem",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: "var(--color-ink)",
            }}
          >
            Clarity
          </span>
        </Link>
      </header>

      {/* Centered content */}
      <main
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem 1rem",
        }}
      >
        <div style={{ width: "100%", maxWidth: 420 }}>{children}</div>
      </main>

      {/* Footer */}
      <footer
        style={{
          padding: "1rem 1.5rem",
          textAlign: "center",
          fontSize: "0.75rem",
          color: "var(--color-ink-faint)",
          borderTop: "1px solid var(--color-border)",
        }}
      >
        By signing in you agree to our{" "}
        <Link href="/terms" style={{ color: "var(--color-amber)" }}>Terms</Link>
        {" & "}
        <Link href="/privacy" style={{ color: "var(--color-amber)" }}>Privacy Policy</Link>
      </footer>
    </div>
  );
}

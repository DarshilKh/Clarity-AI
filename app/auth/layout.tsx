import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

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
          padding: "1rem 1.5rem",
          borderBottom: "1px solid var(--color-border)",
          background: "var(--color-surface-raised)",
        }}
      >
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.45rem",
            textDecoration: "none",
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              position: "relative",
              flexShrink: 0,
            }}
          >
            <Image
              src="/logo-mark.png"
              alt="Clarity"
              fill
              priority
              sizes="38px"
              style={{ objectFit: "contain" }}
            />
          </div>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.25rem",
              fontWeight: 500,
              letterSpacing: "-0.02em",
              color: "var(--color-ink)",
              lineHeight: 1,
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
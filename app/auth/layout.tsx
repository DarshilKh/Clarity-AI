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
      <header style={{ padding: "1.25rem clamp(1rem, 4vw, 2rem)" }}>
        <Link
          href="/"
          style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", textDecoration: "none" }}
        >
          <span style={{ width: 30, height: 30, position: "relative", flexShrink: 0 }}>
            <Image src="/logo-mark.png" alt="" fill priority sizes="30px" style={{ objectFit: "contain" }} />
          </span>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.15rem",
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

      <main
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem clamp(1rem, 4vw, 2rem) 3rem",
        }}
      >
        <div style={{ width: "100%", maxWidth: 400 }}>{children}</div>
      </main>

      <footer
        style={{
          padding: "1.25rem clamp(1rem, 4vw, 2rem)",
          textAlign: "center",
        }}
      >
        <p className="meta">Clarity keeps your decisions private to your account.</p>
      </footer>
    </div>
  );
}

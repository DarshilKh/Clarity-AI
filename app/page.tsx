import Link from "next/link";
import { Brain, ArrowRight, Zap, Shield, BarChart2, Eye } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Multi-Framework Analysis",
    desc: "Expected value, pre-mortem, and WRAP model applied simultaneously — not just a pros/cons list.",
    color: "var(--color-amber)",
  },
  {
    icon: Eye,
    title: "Cognitive Bias Detector",
    desc: "Identifies anchoring, sunk cost fallacy, status quo bias and more lurking in your thinking.",
    color: "var(--color-rose)",
  },
  {
    icon: Zap,
    title: "Second-Order Thinking",
    desc: "See the downstream consequences of each choice — not just the immediate impact.",
    color: "var(--color-sky)",
  },
  {
    icon: BarChart2,
    title: "Outcome Tracking",
    desc: "Follow up at 30, 90, and 180 days to compare predicted vs actual outcomes.",
    color: "var(--color-sage)",
  },
  {
    icon: Shield,
    title: "Decision Journal",
    desc: "Every analysis is saved. Build a record of your thinking patterns and learn from your past.",
    color: "var(--color-amber)",
  },
];

const frameworks = ["Expected Value", "Pre-Mortem", "WRAP Model", "Second-Order Thinking", "Bias Detection"];

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100dvh",
        background: "var(--color-surface)",
        fontFamily: "var(--font-body)",
      }}
    >
      {/* Nav */}
      <nav
        style={{
          borderBottom: "1px solid var(--color-border)",
          background: "var(--color-surface-raised)",
        }}
      >
        <div
          style={{ maxWidth: 1100, margin: "0 auto", padding: "0 1.5rem", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 32,
                height: 32,
                background: "var(--color-ink)",
                borderRadius: "var(--radius-sm)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Brain size={17} color="white" strokeWidth={1.8} />
            </div>
            <span style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", fontWeight: 700, letterSpacing: "-0.03em" }}>
              Clarity
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Link
              href="/dashboard"
              style={{ fontSize: "0.875rem", color: "var(--color-ink-muted)", fontWeight: 500, padding: "0.5rem 0.75rem" }}
            >
              Dashboard
            </Link>
            <Link
              href="/decision/new"
              className="btn btn-primary btn-md"
              style={{
                backgroundColor: "var(--color-ink)",
                color: "white",
                borderRadius: "var(--radius-md)",
                padding: "0.55rem 1.1rem",
                fontSize: "0.875rem",
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: "0.375rem",
                textDecoration: "none",
              }}
            >
              Get Started
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "5rem 1.5rem 4rem", textAlign: "center" }}>
        {/* Tag */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.3rem 0.9rem",
            borderRadius: "var(--radius-full)",
            background: "var(--color-amber-pale)",
            border: "1px solid var(--color-amber-border)",
            marginBottom: "1.75rem",
          }}
        >
          <Zap size={12} color="var(--color-amber)" strokeWidth={2.5} />
          <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--color-amber)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            AI-powered decision science
          </span>
        </div>

        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2.5rem, 6vw, 4rem)",
            fontWeight: 800,
            color: "var(--color-ink)",
            letterSpacing: "-0.04em",
            lineHeight: 1.08,
            marginBottom: "1.5rem",
            maxWidth: 760,
            margin: "0 auto 1.5rem",
          }}
        >
          Stop deciding on gut feel.
          <br />
          <span style={{ color: "var(--color-amber)" }}>Start deciding with clarity.</span>
        </h1>

        <p
          style={{
            fontSize: "1.15rem",
            color: "var(--color-ink-muted)",
            lineHeight: 1.7,
            maxWidth: 560,
            margin: "0 auto 2.5rem",
          }}
        >
          Clarity applies proven decision science frameworks to your biggest life choices — removing emotional bias so you think better, not just faster.
        </p>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.875rem", flexWrap: "wrap" }}>
          <Link
            href="/decision/new"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.8rem 1.8rem",
              background: "var(--color-ink)",
              color: "white",
              borderRadius: "var(--radius-md)",
              fontWeight: 600,
              fontSize: "1rem",
              textDecoration: "none",
              transition: "background 0.15s ease",
            }}
          >
            Analyze a Decision
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/dashboard"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.8rem 1.8rem",
              background: "transparent",
              color: "var(--color-ink-muted)",
              borderRadius: "var(--radius-md)",
              fontWeight: 500,
              fontSize: "1rem",
              textDecoration: "none",
              border: "1px solid var(--color-border)",
            }}
          >
            View Dashboard
          </Link>
        </div>

        {/* Framework pills */}
        <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "0.5rem", marginTop: "2.5rem" }}>
          {frameworks.map((f) => (
            <span
              key={f}
              style={{
                padding: "0.3rem 0.8rem",
                borderRadius: "var(--radius-full)",
                background: "var(--color-surface-alt)",
                border: "1px solid var(--color-border)",
                fontSize: "0.78rem",
                color: "var(--color-ink-muted)",
                fontWeight: 500,
              }}
            >
              {f}
            </span>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 1.5rem" }}>
        <div style={{ height: 1, background: "var(--color-border)" }} />
      </div>

      {/* Features grid */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "4rem 1.5rem" }}>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.75rem",
            fontWeight: 700,
            color: "var(--color-ink)",
            marginBottom: "2rem",
            textAlign: "center",
          }}
        >
          What makes Clarity different
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem" }}>
          {features.map(({ icon: Icon, title, desc, color }) => (
            <div
              key={title}
              className="card card-hover"
              style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "var(--radius-md)",
                  background: "var(--color-surface-alt)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon size={18} color={color} strokeWidth={2} />
              </div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 700, color: "var(--color-ink)" }}>
                {title}
              </h3>
              <p style={{ fontSize: "0.875rem", color: "var(--color-ink-muted)", lineHeight: 1.65 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "0 1.5rem 5rem",
        }}
      >
        <div
          style={{
            background: "var(--color-ink)",
            borderRadius: "var(--radius-xl)",
            padding: "3rem",
            textAlign: "center",
            color: "white",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "2rem",
              fontWeight: 700,
              marginBottom: "0.875rem",
              letterSpacing: "-0.03em",
            }}
          >
            Your next big decision starts here.
          </h2>
          <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.65)", marginBottom: "2rem" }}>
            Free to start. No sign-up required for your first analysis.
          </p>
          <Link
            href="/decision/new"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.8rem 2rem",
              background: "var(--color-amber)",
              color: "white",
              borderRadius: "var(--radius-md)",
              fontWeight: 600,
              fontSize: "1rem",
              textDecoration: "none",
            }}
          >
            Start for Free
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
}

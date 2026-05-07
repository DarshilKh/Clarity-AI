import Link from "next/link";
import {
  Brain, ArrowRight, Zap, Shield, BarChart2,
  Eye, CheckCircle2, Lightbulb, Clock, Star,
} from "lucide-react";

// ── Data ─────────────────────────────────────────────────────────────────────

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
  {
    icon: Lightbulb,
    title: "Actionable Recommendation",
    desc: "No wishy-washy summaries. Clarity gives you a clear recommendation with a confidence score.",
    color: "var(--color-sky)",
  },
];

const steps = [
  {
    number: "01",
    title: "Describe your decision",
    desc: "Tell Clarity what you're deciding, your options, and what matters most to you.",
  },
  {
    number: "02",
    title: "AI runs the analysis",
    desc: "Five decision science frameworks fire simultaneously. Biases are flagged. Consequences are mapped.",
  },
  {
    number: "03",
    title: "Get your recommendation",
    desc: "A clear, unbiased recommendation with a confidence score — ready in under 30 seconds.",
  },
  {
    number: "04",
    title: "Track your outcome",
    desc: "Check back at 30, 90, and 180 days. See how your decision played out and learn from it.",
  },
];

const frameworks = [
  "Expected Value",
  "Pre-Mortem",
  "WRAP Model",
  "Second-Order Thinking",
  "Bias Detection",
];

const socialProof = [
  { value: "2,400+", label: "Decisions analyzed" },
  { value: "94%",   label: "Users report less decision anxiety" },
  { value: "5",     label: "Frameworks per analysis" },
  { value: "< 30s", label: "Time to recommendation" },
];

const testimonials = [
  {
    quote: "I was agonizing over a job offer for weeks. Clarity helped me see I was anchoring on salary and ignoring everything else. I made the call in a day.",
    name: "Priya M.",
    role: "Product Manager",
    stars: 5,
  },
  {
    quote: "The pre-mortem feature alone is worth it. It surfaced risks I hadn't even thought about. This is how I make every big decision now.",
    name: "James R.",
    role: "Startup Founder",
    stars: 5,
  },
  {
    quote: "It doesn't tell you what to do — it shows you how to think. That's the difference between every other AI tool and Clarity.",
    name: "Sofia K.",
    role: "Strategy Consultant",
    stars: 5,
  },
];

// ── Components ────────────────────────────────────────────────────────────────

function Stars({ count }: { count: number }) {
  return (
    <div style={{ display: "flex", gap: 2, marginBottom: "0.75rem" }}>
      {Array.from({ length: count }).map((_, i) => (
        <Star
          key={i}
          size={13}
          fill="var(--color-amber)"
          color="var(--color-amber)"
          strokeWidth={0}
        />
      ))}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100dvh",
        background: "var(--color-surface)",
        fontFamily: "var(--font-body)",
      }}
    >

      {/* ── Nav ── */}
      <nav
        style={{
          borderBottom: "1px solid var(--color-border)",
          background: "var(--color-surface-raised)",
          position: "sticky",
          top: 0,
          zIndex: 50,
          backdropFilter: "blur(12px)",
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "0 1.5rem",
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
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
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.2rem",
                fontWeight: 700,
                letterSpacing: "-0.03em",
                color: "var(--color-ink)",
              }}
            >
              Clarity
            </span>
          </div>

          {/* Nav links */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
            }}
          >
            <Link
              href="#how-it-works"
              style={{
                fontSize: "0.875rem",
                color: "var(--color-ink-muted)",
                fontWeight: 500,
                padding: "0.5rem 0.75rem",
                borderRadius: "var(--radius-md)",
                textDecoration: "none",
              }}
            >
              How it works
            </Link>
            <Link
              href="#features"
              style={{
                fontSize: "0.875rem",
                color: "var(--color-ink-muted)",
                fontWeight: 500,
                padding: "0.5rem 0.75rem",
                borderRadius: "var(--radius-md)",
                textDecoration: "none",
              }}
            >
              Features
            </Link>
            <Link
              href="/auth/login"
              style={{
                fontSize: "0.875rem",
                color: "var(--color-ink-muted)",
                fontWeight: 500,
                padding: "0.5rem 0.75rem",
                borderRadius: "var(--radius-md)",
                textDecoration: "none",
              }}
            >
              Sign in
            </Link>
            <Link
              href="/decision/new"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.375rem",
                padding: "0.55rem 1.1rem",
                background: "var(--color-ink)",
                color: "white",
                borderRadius: "var(--radius-md)",
                fontWeight: 600,
                fontSize: "0.875rem",
                textDecoration: "none",
                marginLeft: "0.25rem",
              }}
            >
              Get Started
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "5.5rem 1.5rem 4.5rem",
          textAlign: "center",
        }}
      >
        {/* Badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.35rem 1rem",
            borderRadius: "var(--radius-full)",
            background: "var(--color-amber-pale)",
            border: "1px solid var(--color-amber-border)",
            marginBottom: "2rem",
          }}
        >
          <Zap size={12} color="var(--color-amber)" strokeWidth={2.5} fill="var(--color-amber)" />
          <span
            style={{
              fontSize: "0.75rem",
              fontWeight: 700,
              color: "var(--color-amber)",
              textTransform: "uppercase",
              letterSpacing: "0.07em",
            }}
          >
            AI-powered decision science
          </span>
        </div>

        {/* Headline */}
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2.6rem, 6.5vw, 4.25rem)",
            fontWeight: 800,
            color: "var(--color-ink)",
            letterSpacing: "-0.04em",
            lineHeight: 1.07,
            maxWidth: 800,
            margin: "0 auto 1.5rem",
          }}
        >
          Stop deciding on{" "}
          <span
            style={{
              textDecoration: "underline",
              textDecorationColor: "var(--color-amber)",
              textDecorationThickness: 3,
              textUnderlineOffset: 6,
            }}
          >
            gut feel.
          </span>
          <br />
          <span style={{ color: "var(--color-amber)" }}>Start deciding with clarity.</span>
        </h1>

        {/* Subheadline */}
        <p
          style={{
            fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
            color: "var(--color-ink-muted)",
            lineHeight: 1.75,
            maxWidth: 580,
            margin: "0 auto 2.5rem",
          }}
        >
          Clarity applies five proven decision science frameworks to your biggest life choices —
          removing emotional bias so you think{" "}
          <em style={{ fontStyle: "normal", color: "var(--color-ink)", fontWeight: 600 }}>better</em>,
          not just faster.
        </p>

        {/* CTAs */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.875rem",
            flexWrap: "wrap",
            marginBottom: "2.75rem",
          }}
        >
          <Link
            href="/decision/new"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.875rem 2rem",
              background: "var(--color-amber)",
              color: "white",
              borderRadius: "var(--radius-md)",
              fontWeight: 700,
              fontSize: "1rem",
              textDecoration: "none",
              boxShadow: "0 4px 20px color-mix(in srgb, var(--color-amber) 30%, transparent)",
            }}
          >
            Analyze a Decision Free
            <ArrowRight size={16} />
          </Link>
          <Link
            href="#how-it-works"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.875rem 2rem",
              background: "transparent",
              color: "var(--color-ink-muted)",
              borderRadius: "var(--radius-md)",
              fontWeight: 500,
              fontSize: "1rem",
              textDecoration: "none",
              border: "1px solid var(--color-border)",
            }}
          >
            See how it works
          </Link>
        </div>

        {/* Trust line */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.4rem",
            marginBottom: "2.5rem",
          }}
        >
          <CheckCircle2 size={14} color="var(--color-sage)" strokeWidth={2.5} />
          <span style={{ fontSize: "0.8rem", color: "var(--color-ink-faint)", fontWeight: 500 }}>
            Free to start &nbsp;·&nbsp; No credit card &nbsp;·&nbsp; 2 analyses per day free
          </span>
        </div>

        {/* Framework pills */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "0.5rem",
          }}
        >
          {frameworks.map((f) => (
            <span
              key={f}
              style={{
                padding: "0.3rem 0.85rem",
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

      {/* ── Social proof bar ── */}
      <section
        style={{
          borderTop: "1px solid var(--color-border)",
          borderBottom: "1px solid var(--color-border)",
          background: "var(--color-surface-raised)",
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "2rem 1.5rem",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "1.5rem",
            textAlign: "center",
          }}
        >
          {socialProof.map(({ value, label }) => (
            <div key={label}>
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(1.6rem, 4vw, 2.1rem)",
                  fontWeight: 800,
                  color: "var(--color-ink)",
                  letterSpacing: "-0.03em",
                  lineHeight: 1,
                  marginBottom: "0.35rem",
                }}
              >
                {value}
              </p>
              <p
                style={{
                  fontSize: "0.8rem",
                  color: "var(--color-ink-faint)",
                  fontWeight: 500,
                }}
              >
                {label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section
        id="how-it-works"
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "5rem 1.5rem",
        }}
      >
        {/* Section label */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <span
            style={{
              display: "inline-block",
              fontSize: "0.72rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--color-amber)",
              marginBottom: "0.75rem",
            }}
          >
            The process
          </span>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.6rem, 4vw, 2.25rem)",
              fontWeight: 800,
              color: "var(--color-ink)",
              letterSpacing: "-0.03em",
              marginBottom: "0.75rem",
            }}
          >
            From confusion to clarity in 4 steps
          </h2>
          <p
            style={{
              fontSize: "1rem",
              color: "var(--color-ink-muted)",
              maxWidth: 480,
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            No lengthy onboarding. No complex setup. Just describe your decision and let the
            science do the work.
          </p>
        </div>

        {/* Steps */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "1.25rem",
          }}
        >
          {steps.map(({ number, title, desc }) => (
            <div
              key={number}
              className="card"
              style={{ position: "relative", paddingTop: "1.5rem" }}
            >
              {/* Step number */}
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  color: "var(--color-amber)",
                  letterSpacing: "0.05em",
                  display: "block",
                  marginBottom: "0.75rem",
                }}
              >
                {number}
              </span>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1rem",
                  fontWeight: 700,
                  color: "var(--color-ink)",
                  marginBottom: "0.5rem",
                }}
              >
                {title}
              </h3>
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "var(--color-ink-muted)",
                  lineHeight: 1.65,
                }}
              >
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section
        id="features"
        style={{
          background: "var(--color-surface-raised)",
          borderTop: "1px solid var(--color-border)",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "5rem 1.5rem",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <span
              style={{
                display: "inline-block",
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--color-amber)",
                marginBottom: "0.75rem",
              }}
            >
              Features
            </span>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.6rem, 4vw, 2.25rem)",
                fontWeight: 800,
                color: "var(--color-ink)",
                letterSpacing: "-0.03em",
                marginBottom: "0.75rem",
              }}
            >
              What makes Clarity different
            </h2>
            <p
              style={{
                fontSize: "1rem",
                color: "var(--color-ink-muted)",
                maxWidth: 440,
                margin: "0 auto",
                lineHeight: 1.7,
              }}
            >
              Not another chatbot. A structured thinking partner built on decades of
              decision research.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "1rem",
            }}
          >
            {features.map(({ icon: Icon, title, desc, color }) => (
              <div
                key={title}
                className="card card-hover"
                style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: "var(--radius-md)",
                    background: "var(--color-surface-alt)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon size={18} color={color} strokeWidth={2} />
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: "var(--color-ink)",
                  }}
                >
                  {title}
                </h3>
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "var(--color-ink-muted)",
                    lineHeight: 1.65,
                  }}
                >
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "5rem 1.5rem",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <span
            style={{
              display: "inline-block",
              fontSize: "0.72rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--color-amber)",
              marginBottom: "0.75rem",
            }}
          >
            What people say
          </span>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.6rem, 4vw, 2.25rem)",
              fontWeight: 800,
              color: "var(--color-ink)",
              letterSpacing: "-0.03em",
            }}
          >
            Decisions people are proud of
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1rem",
          }}
        >
          {testimonials.map(({ quote, name, role, stars }) => (
            <div
              key={name}
              className="card"
              style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}
            >
              <Stars count={stars} />
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "var(--color-ink-muted)",
                  lineHeight: 1.7,
                  fontStyle: "italic",
                  flex: 1,
                  marginBottom: "1rem",
                }}
              >
                &ldquo;{quote}&rdquo;
              </p>
              <div>
                <p
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    color: "var(--color-ink)",
                  }}
                >
                  {name}
                </p>
                <p style={{ fontSize: "0.78rem", color: "var(--color-ink-faint)" }}>
                  {role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
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
            padding: "clamp(2.5rem, 6vw, 4rem) clamp(1.5rem, 4vw, 3rem)",
            textAlign: "center",
            color: "white",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Subtle glow orb */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              top: "-40%",
              left: "50%",
              transform: "translateX(-50%)",
              width: 500,
              height: 300,
              borderRadius: "50%",
              background:
                "radial-gradient(ellipse, color-mix(in srgb, var(--color-amber) 18%, transparent) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          <div style={{ position: "relative" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.3rem 0.9rem",
                borderRadius: "var(--radius-full)",
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.12)",
                marginBottom: "1.5rem",
              }}
            >
              <Clock size={12} color="rgba(255,255,255,0.7)" />
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.7)",
                }}
              >
                Ready in under 30 seconds
              </span>
            </div>

            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
                fontWeight: 800,
                color: "white",
                marginBottom: "1rem",
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
              }}
            >
              Your next big decision starts here.
            </h2>

            <p
              style={{
                fontSize: "1rem",
                color: "rgba(255,255,255,0.6)",
                marginBottom: "2rem",
                maxWidth: 440,
                margin: "0 auto 2rem",
                lineHeight: 1.65,
              }}
            >
              Free to start. No BS, no fluff —
              just better thinking.
            </p>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.875rem",
                flexWrap: "wrap",
              }}
            >
              <Link
                href="/decision/new"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.875rem 2rem",
                  background: "var(--color-amber)",
                  color: "white",
                  borderRadius: "var(--radius-md)",
                  fontWeight: 700,
                  fontSize: "1rem",
                  textDecoration: "none",
                }}
              >
                Start for Free
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/auth/login"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.875rem 2rem",
                  background: "rgba(255,255,255,0.08)",
                  color: "rgba(255,255,255,0.85)",
                  borderRadius: "var(--radius-md)",
                  fontWeight: 500,
                  fontSize: "1rem",
                  textDecoration: "none",
                  border: "1px solid rgba(255,255,255,0.12)",
                }}
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        style={{
          borderTop: "1px solid var(--color-border)",
          background: "var(--color-surface-raised)",
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "2rem 1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          {/* Brand */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 26,
                height: 26,
                background: "var(--color-ink)",
                borderRadius: "var(--radius-sm)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Brain size={13} color="white" strokeWidth={1.8} />
            </div>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1rem",
                fontWeight: 700,
                letterSpacing: "-0.03em",
                color: "var(--color-ink)",
              }}
            >
              Clarity
            </span>
          </div>

          {/* Links */}
          <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
            {[
              { label: "Dashboard", href: "/dashboard" },
              { label: "New Decision", href: "/decision/new" },
              { label: "Journal", href: "/journal" },
              { label: "Sign in", href: "/auth/login" },
            ].map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                style={{
                  fontSize: "0.82rem",
                  color: "var(--color-ink-faint)",
                  textDecoration: "none",
                  fontWeight: 500,
                }}
              >
                {label}
              </Link>
            ))}
          </div>

          <p style={{ fontSize: "0.78rem", color: "var(--color-ink-faint)" }}>
            © {new Date().getFullYear()} Clarity
          </p>
        </div>
      </footer>
    </main>
  );
}
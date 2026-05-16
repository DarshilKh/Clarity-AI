"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Brain, ArrowRight, Sparkles, Shield, BarChart2,
  Eye, CheckCircle2, Lightbulb, Clock, Star, Zap,
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

/** Logo — refined balance between mark and wordmark */
function Logo({ size = 48, wordmark = "1.55rem" }: { size?: number; wordmark?: string }) {
  return (
    <Link
      href="/"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        textDecoration: "none",
      }}
    >
      <div
        style={{
          width: size,
          height: size,
          position: "relative",
          flexShrink: 0,
        }}
      >
        <Image
          src="/logo-mark.png"
          alt="Clarity"
          fill
          priority
          sizes={`${size}px`}
          style={{
            objectFit: "contain",
          }}
        />
      </div>
      <span
        style={{
          fontFamily: "var(--font-display)",
          fontSize: wordmark,
          fontWeight: 500,
          letterSpacing: "-0.02em",
          color: "var(--color-ink)",
          lineHeight: 1,
        }}
      >
        Clarity
      </span>
    </Link>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <main
      style={{
        minHeight: "100dvh",
        background: "var(--color-surface)",
        fontFamily: "var(--font-body)",
      }}
    >

      {/* ── Nav (transparent → blurred on scroll) ── */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          height: 80,
          background: scrolled ? "rgba(246, 242, 236, 0.72)" : "transparent",
          backdropFilter: scrolled ? "blur(20px) saturate(140%)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(20px) saturate(140%)" : "none",
          borderBottom: scrolled
            ? "1px solid rgba(0, 0, 0, 0.05)"
            : "1px solid transparent",
          boxShadow: scrolled
            ? "0 1px 20px rgba(13, 13, 13, 0.04)"
            : "none",
          transition: "all 300ms ease-out",
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "0 3rem",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <Logo size={40} wordmark="1.55rem" />

          {/* Nav links — softer black/70 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
            }}
          >
            <Link
              href="#how-it-works"
              className="nav-link"
              style={{
                fontSize: "0.92rem",
                color: "rgba(0, 0, 0, 0.7)",
                fontWeight: 500,
                padding: "0.5rem 1rem",
                borderRadius: "var(--radius-md)",
                textDecoration: "none",
                transition: "color 200ms ease",
              }}
            >
              How it works
            </Link>
            <Link
              href="#features"
              className="nav-link"
              style={{
                fontSize: "0.92rem",
                color: "rgba(0, 0, 0, 0.7)",
                fontWeight: 500,
                padding: "0.5rem 1rem",
                borderRadius: "var(--radius-md)",
                textDecoration: "none",
                transition: "color 200ms ease",
              }}
            >
              Features
            </Link>
            <Link
              href="/auth/login"
              className="nav-link"
              style={{
                fontSize: "0.92rem",
                color: "rgba(0, 0, 0, 0.7)",
                fontWeight: 500,
                padding: "0.5rem 1rem",
                borderRadius: "var(--radius-md)",
                textDecoration: "none",
                marginRight: "0.5rem",
                transition: "color 200ms ease",
              }}
            >
              Sign in
            </Link>
            <Link
              href="/decision/new"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.45rem",
                padding: "0.7rem 1.3rem",
                background: "var(--color-ink)",
                color: "white",
                borderRadius: "var(--radius-md)",
                fontWeight: 600,
                fontSize: "0.92rem",
                textDecoration: "none",
                transition: "transform 200ms ease",
              }}
            >
              Get Started
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section
        style={{
          position: "relative",
          width: "100%",
          minHeight: "100vh",
          backgroundImage: "url('/bg-img-clarity.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          isolation: "isolate",
        }}
      >
        {/* Right-side glow softener — slightly dimmed */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, transparent 0%, transparent 52%, rgba(245, 242, 237, 0.38) 80%, rgba(245, 242, 237, 0.56) 100%)",
            zIndex: 1,
            pointerEvents: "none",
          }}
        />

        {/* Additional right-edge soft veil */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            width: "42%",
            background:
              "radial-gradient(ellipse at right center, rgba(245, 242, 237, 0.24) 0%, transparent 70%)",
            zIndex: 1,
            pointerEvents: "none",
          }}
        />

        {/* Subtle radial glow behind text */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: "52%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "min(950px, 92%)",
            height: "min(620px, 78%)",
            background:
              "radial-gradient(ellipse at center, rgba(250, 247, 240, 0.5) 0%, rgba(250, 247, 240, 0.2) 40%, transparent 75%)",
            zIndex: 1,
            pointerEvents: "none",
            filter: "blur(24px)",
          }}
        />

        {/* Top/bottom edge fade */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(245, 242, 237, 0.25) 0%, transparent 12%, transparent 85%, rgba(245, 242, 237, 0.5) 100%)",
            zIndex: 1,
            pointerEvents: "none",
          }}
        />

        {/* Content — optically centered, nudged up */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            maxWidth: 960,
            width: "100%",
            padding: "8rem 1.5rem 4rem",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            transform: "translate(-0.6%, -12px)",
          }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.5rem 1.1rem",
              borderRadius: "var(--radius-full)",
              background: "rgba(255, 255, 255, 0.65)",
              border: "1px solid rgba(216, 210, 200, 0.6)",
              marginBottom: "2.25rem",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
            }}
          >
            <Sparkles size={14} color="var(--color-amber)" strokeWidth={2.2} />
            <span
              style={{
                fontSize: "0.88rem",
                fontWeight: 500,
                color: "var(--color-ink-soft)",
                letterSpacing: "0.005em",
              }}
            >
              AI-Powered Decision Science
            </span>
          </motion.div>

          {/* Headline — tighter editorial tracking */}
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.4rem, 5.2vw, 4rem)",
              fontWeight: 600,
              color: "var(--color-ink)",
              letterSpacing: "-0.04em",
              lineHeight: 1.1,
              maxWidth: 860,
              margin: "0 auto 1.75rem",
            }}
          >
            Stop deciding on gut feel.
            <br />
            Start deciding with{" "}
            <span style={{ color: "var(--color-amber)", fontWeight: 600 }}>
              clarity.
            </span>
          </motion.h1>

          {/* Subheading — narrower for readability */}
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            style={{
              fontSize: "clamp(1.05rem, 1.5vw, 1.18rem)",
              color: "var(--color-ink-muted)",
              lineHeight: 1.7,
              maxWidth: 560,
              margin: "0 auto 2.75rem",
              fontWeight: 400,
            }}
          >
            Clarity applies proven decision science frameworks to your biggest life choices —
            removing emotional bias so you think better, not just faster.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.85rem",
              flexWrap: "wrap",
              marginBottom: "2rem",
            }}
          >
            <Link
              href="/decision/new"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.55rem",
                padding: "0.95rem 1.85rem",
                background: "var(--color-ink)",
                color: "white",
                borderRadius: "var(--radius-md)",
                fontWeight: 600,
                fontSize: "1rem",
                textDecoration: "none",
                boxShadow: "0 10px 28px rgba(13, 13, 13, 0.22)",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
              }}
            >
              Analyze a Decision Free
              <ArrowRight size={16} />
            </Link>

            {/* Secondary — softer integration */}
            <Link
              href="#how-it-works"
              className="secondary-cta"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.55rem",
                padding: "0.95rem 1.85rem",
                background: "rgba(255, 255, 255, 0.65)",
                color: "var(--color-ink)",
                borderRadius: "var(--radius-md)",
                fontWeight: 500,
                fontSize: "1rem",
                textDecoration: "none",
                border: "1px solid rgba(0, 0, 0, 0.05)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                transition: "background 250ms ease, border-color 250ms ease",
              }}
            >
              See how it works
              <ArrowRight size={16} />
            </Link>
          </motion.div>

          {/* Trust line */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.45 }}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.55rem",
              fontSize: "0.9rem",
              color: "var(--color-ink-muted)",
              fontWeight: 500,
              flexWrap: "wrap",
            }}
          >
            <CheckCircle2 size={15} color="var(--color-sage)" strokeWidth={2.5} />
            <span>Free to start</span>
            <span style={{ opacity: 0.4 }}>·</span>
            <span>No credit card</span>
            <span style={{ opacity: 0.4 }}>·</span>
            <span>2 analyses per day free</span>
          </motion.div>
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
            maxWidth: 1200,
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
                  fontWeight: 700,
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
                  fontSize: "0.85rem",
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
          maxWidth: 1200,
          margin: "0 auto",
          padding: "5rem 1.5rem",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <span
            style={{
              display: "inline-block",
              fontSize: "0.78rem",
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
              fontSize: "clamp(1.75rem, 4vw, 2.4rem)",
              fontWeight: 700,
              color: "var(--color-ink)",
              letterSpacing: "-0.03em",
              marginBottom: "0.75rem",
            }}
          >
            From confusion to clarity in 4 steps
          </h2>
          <p
            style={{
              fontSize: "1.05rem",
              color: "var(--color-ink-muted)",
              maxWidth: 520,
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            No lengthy onboarding. No complex setup. Just describe your decision and let the
            science do the work.
          </p>
        </div>

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
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.75rem",
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
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  color: "var(--color-ink)",
                  marginBottom: "0.5rem",
                }}
              >
                {title}
              </h3>
              <p
                style={{
                  fontSize: "0.93rem",
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
            maxWidth: 1200,
            margin: "0 auto",
            padding: "5rem 1.5rem",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <span
              style={{
                display: "inline-block",
                fontSize: "0.78rem",
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
                fontSize: "clamp(1.75rem, 4vw, 2.4rem)",
                fontWeight: 700,
                color: "var(--color-ink)",
                letterSpacing: "-0.03em",
                marginBottom: "0.75rem",
              }}
            >
              What makes Clarity different
            </h2>
            <p
              style={{
                fontSize: "1.05rem",
                color: "var(--color-ink-muted)",
                maxWidth: 480,
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
                    width: 42,
                    height: 42,
                    borderRadius: "var(--radius-md)",
                    background: "var(--color-surface-alt)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon size={20} color={color} strokeWidth={2} />
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    color: "var(--color-ink)",
                  }}
                >
                  {title}
                </h3>
                <p
                  style={{
                    fontSize: "0.93rem",
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
          maxWidth: 1200,
          margin: "0 auto",
          padding: "5rem 1.5rem",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <span
            style={{
              display: "inline-block",
              fontSize: "0.78rem",
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
              fontSize: "clamp(1.75rem, 4vw, 2.4rem)",
              fontWeight: 700,
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
                  fontSize: "0.95rem",
                  color: "var(--color-ink-muted)",
                  lineHeight: 1.7,
                  flex: 1,
                  marginBottom: "1rem",
                }}
              >
                &ldquo;{quote}&rdquo;
              </p>
              <div>
                <p
                  style={{
                    fontSize: "0.9rem",
                    fontWeight: 700,
                    color: "var(--color-ink)",
                  }}
                >
                  {name}
                </p>
                <p style={{ fontSize: "0.82rem", color: "var(--color-ink-faint)" }}>
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
          maxWidth: 1200,
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
                padding: "0.35rem 1rem",
                borderRadius: "var(--radius-full)",
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.12)",
                marginBottom: "1.5rem",
              }}
            >
              <Clock size={13} color="rgba(255,255,255,0.7)" />
              <span
                style={{
                  fontSize: "0.82rem",
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
                fontSize: "clamp(1.85rem, 4vw, 2.6rem)",
                fontWeight: 700,
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
                fontSize: "1.05rem",
                color: "rgba(255,255,255,0.65)",
                marginBottom: "2rem",
                maxWidth: 480,
                margin: "0 auto 2rem",
                lineHeight: 1.65,
              }}
            >
              Free to start. No BS, no fluff — just better thinking.
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
                  padding: "0.95rem 2rem",
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
              <Link
                href="/auth/login"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.95rem 2rem",
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
            maxWidth: 1200,
            margin: "0 auto",
            padding: "2rem 1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <Logo size={34} wordmark="1.15rem" />

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
                  fontSize: "0.85rem",
                  color: "var(--color-ink-faint)",
                  textDecoration: "none",
                  fontWeight: 500,
                }}
              >
                {label}
              </Link>
            ))}
          </div>

          <p style={{ fontSize: "0.8rem", color: "var(--color-ink-faint)" }}>
            © {new Date().getFullYear()} Clarity
          </p>
        </div>
      </footer>

      {/* Hover states */}
      <style>{`
        .nav-link:hover { color: rgba(0, 0, 0, 1) !important; }
        .secondary-cta:hover {
          background: rgba(255, 255, 255, 0.85) !important;
          border-color: rgba(0, 0, 0, 0.08) !important;
        }
      `}</style>
    </main>
  );
}
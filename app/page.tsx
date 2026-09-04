"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight, Sparkles, CheckCircle2,
  Layers, Scale, Eye, GitBranch, BarChart2, BookOpen,
} from "lucide-react";

// ── Data ─────────────────────────────────────────────────────────────────────

const features = [
  {
    icon: Layers,
    title: "Multi-framework analysis",
    desc: "Expected value, pre-mortem and the WRAP model applied together — not just a pros and cons list.",
    color: "var(--color-amber)",
  },
  {
    icon: Eye,
    title: "Potential biases surfaced",
    desc: "Reasoning patterns worth a second look — flagged only when your own wording gives evidence for them.",
    color: "var(--color-rose)",
  },
  {
    icon: GitBranch,
    title: "Second-order effects",
    desc: "See the downstream consequences of each choice — not just the immediate impact.",
    color: "var(--color-sky)",
  },
  {
    icon: BarChart2,
    title: "Outcome tracking",
    desc: "Follow up at 30, 90, and 180 days to compare predicted vs actual outcomes.",
    color: "var(--color-sage)",
  },
  {
    icon: BookOpen,
    title: "Decision journal",
    desc: "Every analysis is saved. Build a record of your thinking patterns and learn from your past.",
    color: "var(--color-amber)",
  },
  {
    icon: Scale,
    title: "Evidence, separated from assumption",
    desc: "Every claim traces back to something you wrote. What you did not provide is marked unknown, never filled in.",
    color: "var(--color-sky)",
  },
];

const steps = [
  {
    number: "01",
    title: "Describe the decision",
    desc: "The situation, the options you are weighing, and the constraints that actually matter.",
  },
  {
    number: "02",
    title: "Clarity structures it",
    desc: "Your input is sorted into what you have established, what follows from it, and what is still unknown.",
  },
  {
    number: "03",
    title: "Read the recommendation",
    desc: "A clear call with a confidence level, the reasoning behind it, and the unknown that would change it.",
  },
  {
    number: "04",
    title: "Track the outcome",
    desc: "Check back at 30, 90, and 180 days. See how your decision played out and learn from it.",
  },
];


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

      {/* ── What every analysis includes ── */}
      <section
        style={{
          borderTop: "1px solid var(--color-border)",
          borderBottom: "1px solid var(--color-border)",
          background: "var(--color-surface-raised)",
        }}
      >
        <div
          style={{
            maxWidth: 1180,
            margin: "0 auto",
            padding: "clamp(2.5rem, 6vw, 3.5rem) clamp(1.25rem, 5vw, 3rem)",
          }}
        >
          <p
            className="eyebrow"
            style={{ marginBottom: "1.75rem", textAlign: "center" }}
          >
            Every analysis includes
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 200px), 1fr))",
              gap: "clamp(1.5rem, 4vw, 2.5rem)",
            }}
          >
            {[
              { label: "A clear verdict", desc: "The recommendation, stated plainly" },
              { label: "A confidence level", desc: "How much rests on what's still unknown" },
              { label: "The trade-offs", desc: "Each option weighed side by side" },
              { label: "What's missing", desc: "The gaps that would change the answer" },
            ].map(({ label, desc }) => (
              <div key={label} style={{ textAlign: "center" }}>
                <p
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.05rem",
                    fontWeight: 600,
                    letterSpacing: "-0.02em",
                    color: "var(--color-ink)",
                    marginBottom: "0.35rem",
                  }}
                >
                  {label}
                </p>
                <p
                  style={{
                    fontSize: "0.85rem",
                    color: "var(--color-ink-muted)",
                    lineHeight: 1.55,
                  }}
                >
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section
        id="how-it-works"
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          padding: "clamp(4rem, 9vw, 6.5rem) clamp(1.25rem, 5vw, 3rem)",
        }}
      >
        <div style={{ marginBottom: "clamp(2.5rem, 5vw, 3.5rem)", maxWidth: 620 }}>
          <span className="eyebrow" style={{ marginBottom: "0.9rem" }}>
            How it works
          </span>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.65rem, 4vw, 2.4rem)",
              fontWeight: 600,
              color: "var(--color-ink)",
              letterSpacing: "-0.035em",
              lineHeight: 1.15,
              marginBottom: "0.9rem",
            }}
          >
            From a tangled choice to a structured decision
          </h2>
          <p
            style={{
              fontSize: "1.02rem",
              color: "var(--color-ink-muted)",
              lineHeight: 1.7,
            }}
          >
            No onboarding, no setup. You describe the decision once — everything else follows from it.
          </p>
        </div>

        <ol
          style={{
            listStyle: "none",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))",
            gap: "clamp(2rem, 4vw, 2.5rem)",
          }}
        >
          {steps.map(({ number, title, desc }) => (
            <li key={number}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  marginBottom: "1rem",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.72rem",
                    fontWeight: 600,
                    color: "var(--color-amber)",
                    letterSpacing: "0.06em",
                  }}
                >
                  {number}
                </span>
                <span
                  aria-hidden
                  style={{ flex: 1, height: 1, background: "var(--color-border)" }}
                />
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.12rem",
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                  color: "var(--color-ink)",
                  marginBottom: "0.55rem",
                }}
              >
                {title}
              </h3>
              <p
                style={{
                  fontSize: "0.92rem",
                  color: "var(--color-ink-muted)",
                  lineHeight: 1.7,
                }}
              >
                {desc}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* ── The distinguishing idea ── */}
      <section
        style={{
          borderTop: "1px solid var(--color-border)",
          borderBottom: "1px solid var(--color-border)",
          background: "var(--color-surface-raised)",
        }}
      >
        <div
          style={{
            maxWidth: 1180,
            margin: "0 auto",
            padding: "clamp(4rem, 9vw, 6rem) clamp(1.25rem, 5vw, 3rem)",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
            gap: "clamp(2rem, 5vw, 4.5rem)",
            alignItems: "start",
          }}
        >
          <div>
            <span className="eyebrow" style={{ marginBottom: "0.9rem" }}>
              Why it&apos;s different
            </span>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.65rem, 4vw, 2.4rem)",
                fontWeight: 600,
                color: "var(--color-ink)",
                letterSpacing: "-0.035em",
                lineHeight: 1.15,
              }}
            >
              It tells you when it doesn&apos;t know.
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <p style={{ fontSize: "1.02rem", color: "var(--color-ink-soft)", lineHeight: 1.75 }}>
              Most tools produce a confident answer no matter how little you gave them. Clarity
              won&apos;t. If your options are described too thinly to tell apart, it says so plainly —
              and names the missing detail that would settle it.
            </p>
            <p style={{ fontSize: "1.02rem", color: "var(--color-ink-muted)", lineHeight: 1.75 }}>
              Nothing about your options is invented. No assumed salary, culture, risk or timeline.
              Scores appear only when your own facts justify them, and confidence reflects how much of
              the recommendation still rests on something unresolved.
            </p>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section
        id="features"
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          padding: "clamp(4rem, 9vw, 6.5rem) clamp(1.25rem, 5vw, 3rem)",
        }}
      >
        <div style={{ marginBottom: "clamp(2.5rem, 5vw, 3.5rem)", maxWidth: 620 }}>
          <span className="eyebrow" style={{ marginBottom: "0.9rem" }}>
            What you get
          </span>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.65rem, 4vw, 2.4rem)",
              fontWeight: 600,
              color: "var(--color-ink)",
              letterSpacing: "-0.035em",
              lineHeight: 1.15,
              marginBottom: "0.9rem",
            }}
          >
            A complete breakdown, not a paragraph of advice
          </h2>
          <p style={{ fontSize: "1.02rem", color: "var(--color-ink-muted)", lineHeight: 1.7 }}>
            One decision produces every layer below — structured, scannable, and grounded in what you
            actually told it.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 290px), 1fr))",
            gap: "clamp(1.75rem, 3vw, 2.25rem) clamp(2rem, 4vw, 3rem)",
          }}
        >
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} style={{ borderTop: "1px solid var(--color-border)", paddingTop: "1.25rem" }}>
              <Icon
                size={18}
                color="var(--color-ink-faint)"
                strokeWidth={1.75}
                style={{ marginBottom: "0.9rem" }}
                aria-hidden
              />
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.05rem",
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                  color: "var(--color-ink)",
                  marginBottom: "0.5rem",
                }}
              >
                {title}
              </h3>
              <p style={{ fontSize: "0.92rem", color: "var(--color-ink-muted)", lineHeight: 1.7 }}>
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── What the output looks like ── */}
      <section
        style={{
          borderTop: "1px solid var(--color-border)",
          background: "var(--color-surface-raised)",
        }}
      >
        <div
          style={{
            maxWidth: 1180,
            margin: "0 auto",
            padding: "clamp(4rem, 9vw, 6rem) clamp(1.25rem, 5vw, 3rem)",
          }}
        >
          <div style={{ marginBottom: "clamp(2rem, 4vw, 2.75rem)", maxWidth: 620 }}>
            <span className="eyebrow" style={{ marginBottom: "0.9rem" }}>
              The output
            </span>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.65rem, 4vw, 2.4rem)",
                fontWeight: 600,
                color: "var(--color-ink)",
                letterSpacing: "-0.035em",
                lineHeight: 1.15,
              }}
            >
              You&apos;ll understand the answer in ten seconds
            </h2>
          </div>

          {/* Verdict preview — mirrors the real analysis screen */}
          <div
            style={{
              background: "var(--color-ink)",
              borderRadius: "var(--radius-xl)",
              padding: "clamp(1.5rem, 4vw, 2.25rem)",
              maxWidth: 720,
            }}
          >
            <p
              style={{
                fontSize: "0.72rem",
                fontWeight: 600,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.45)",
                marginBottom: "1rem",
              }}
            >
              Clarity&apos;s verdict
            </p>

            <p style={{ fontSize: "0.78rem", fontWeight: 600, color: "rgba(255,255,255,0.5)", marginBottom: "0.5rem" }}>
              Recommended
            </p>

            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.4rem, 3.5vw, 2rem)",
                fontWeight: 600,
                letterSpacing: "-0.03em",
                lineHeight: 1.12,
                color: "#fff",
                marginBottom: "1.25rem",
              }}
            >
              Stay employed, build nights and weekends
            </p>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                paddingBottom: "1.25rem",
                marginBottom: "1.25rem",
                borderBottom: "1px solid rgba(255,255,255,0.12)",
                flexWrap: "wrap",
              }}
            >
              <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.5)" }}>Confidence</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.95rem", fontWeight: 600, color: "#fff" }}>
                70%
              </span>
              <span style={{ color: "rgba(255,255,255,0.25)" }}>·</span>
              <span style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.72)", fontWeight: 500 }}>
                Medium
              </span>
              <span
                aria-hidden
                style={{ flex: 1, minWidth: 60, height: 2, background: "rgba(255,255,255,0.14)", borderRadius: 1 }}
              >
                <span
                  style={{
                    display: "block",
                    width: "70%",
                    height: "100%",
                    background: "var(--color-amber)",
                    borderRadius: 1,
                  }}
                />
              </span>
            </div>

            <p
              style={{
                fontSize: "0.72rem",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.4)",
                marginBottom: "0.5rem",
              }}
            >
              What would change this
            </p>
            <p style={{ fontSize: "0.95rem", lineHeight: 1.7, color: "rgba(255,255,255,0.62)", maxWidth: "62ch" }}>
              The recommendation rests on your stated runway and the three customers who said they&apos;d
              pay. How quickly that revenue actually materialises is unknown — if it lands sooner than
              expected, going full-time becomes the stronger call.
            </p>
          </div>

          <p style={{ fontSize: "0.82rem", color: "var(--color-ink-faint)", marginTop: "1rem" }}>
            An illustration of the verdict panel — every analysis also includes the option comparison,
            pre-mortem, second-order effects and open questions.
          </p>
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          padding: "clamp(4rem, 9vw, 6rem) clamp(1.25rem, 5vw, 3rem)",
        }}
      >
        <div
          style={{
            borderTop: "1px solid var(--color-border)",
            paddingTop: "clamp(2.5rem, 6vw, 4rem)",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: "2rem",
            flexWrap: "wrap",
          }}
        >
          <div style={{ maxWidth: 520 }}>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.75rem, 4.5vw, 2.6rem)",
                fontWeight: 600,
                color: "var(--color-ink)",
                letterSpacing: "-0.035em",
                lineHeight: 1.12,
                marginBottom: "0.9rem",
              }}
            >
              What are you deciding?
            </h2>
            <p style={{ fontSize: "1.02rem", color: "var(--color-ink-muted)", lineHeight: 1.7 }}>
              Write it out once. You&apos;ll only be asked to create an account when your analysis is
              ready to run — nothing you&apos;ve written is lost along the way.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <Link
              href="/decision/new"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                padding: "0.95rem 2rem",
                background: "var(--color-ink)",
                color: "white",
                borderRadius: "var(--radius-md)",
                fontWeight: 600,
                fontSize: "1rem",
                textDecoration: "none",
                whiteSpace: "nowrap",
              }}
            >
              Analyze a decision
              <ArrowRight size={16} />
            </Link>
            <p style={{ fontSize: "0.82rem", color: "var(--color-ink-faint)", textAlign: "center" }}>
              2 analyses per day free
            </p>
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
            maxWidth: 1180,
            margin: "0 auto",
            padding: "2.25rem clamp(1.25rem, 5vw, 3rem)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1.25rem",
          }}
        >
          <Logo size={28} wordmark="1.1rem" />

          <nav style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
            {[
              { label: "How it works", href: "#how-it-works" },
              { label: "What you get", href: "#features" },
              { label: "New decision", href: "/decision/new" },
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
          </nav>

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
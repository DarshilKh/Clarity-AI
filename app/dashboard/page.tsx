"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Toasts from "@/components/ui/Toasts";
import DecisionCard from "@/components/decision/DecisionCard";
import type { Decision } from "@/types";
import { Plus, Brain, TrendingUp, CheckCircle2, BookOpen, Loader2, Sparkles } from "lucide-react";

function StatCard({
  label, value, icon: Icon, color, sub,
}: {
  label: string; value: number | string; icon: React.ElementType; color: string; sub?: string;
}) {
  return (
    <div
      className="card"
      style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}
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
        <Icon size={19} color={color} strokeWidth={2} />
      </div>
      <div style={{ minWidth: 0 }}>
        <p
          style={{
            fontSize: "clamp(1.25rem, 4vw, 1.6rem)",
            fontWeight: 800,
            color: "var(--color-ink)",
            fontFamily: "var(--font-mono)",
            lineHeight: 1,
          }}
        >
          {value}
        </p>
        <p style={{ fontSize: "0.75rem", color: "var(--color-ink-faint)", marginTop: "0.25rem", lineHeight: 1.3 }}>
          {label}
          {sub && <span style={{ display: "block", color: "var(--color-ink-faint)", fontSize: "0.68rem" }}>{sub}</span>}
        </p>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="card" style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <div className="shimmer" style={{ height: 20, width: "60%" }} />
      <div className="shimmer" style={{ height: 14, width: "90%" }} />
      <div className="shimmer" style={{ height: 14, width: "75%" }} />
      <div className="shimmer" style={{ height: 32, width: "40%", marginTop: "0.5rem" }} />
    </div>
  );
}

export default function DashboardPage() {
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    async function fetchDecisions() {
      try {
        const res = await fetch("/api/decisions");
        if (res.ok) {
          const data = (await res.json()) as { decisions: Decision[] };
          setDecisions(data.decisions);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchDecisions();
  }, []);

  const decided  = decisions.filter((d) => d.status === "decided" || d.status === "tracking").length;
  const tracked  = decisions.filter((d) => d.status === "tracking").length;
  const avgConf  = decisions.length > 0
    ? Math.round(decisions.reduce((s, d) => s + (d.analysis?.confidenceScore ?? 0), 0) / decisions.length)
    : 0;

  return (
    <>
      <Navbar />
      <Toasts />

      <div style={{ minHeight: "calc(100dvh - 60px)", background: "var(--color-surface)" }}>
        <div className="page-wrap">

          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              marginBottom: "1.75rem",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <div>
              <h1
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(1.5rem, 5vw, 2rem)",
                  fontWeight: 800,
                  color: "var(--color-ink)",
                  letterSpacing: "-0.03em",
                  marginBottom: "0.25rem",
                }}
              >
                Dashboard
              </h1>
              <p style={{ color: "var(--color-ink-muted)", fontSize: "0.875rem" }}>
                Your decisions, analyses, and outcomes.
              </p>
            </div>

            <Link
              href="/decision/new"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.65rem 1.25rem",
                background: "var(--color-ink)",
                color: "white",
                borderRadius: "var(--radius-md)",
                fontWeight: 600,
                fontSize: "0.875rem",
                textDecoration: "none",
                minHeight: 44,
                whiteSpace: "nowrap",
              }}
            >
              <Plus size={15} />
              New Decision
            </Link>
          </div>

          {/* Stats grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: "0.875rem",
              marginBottom: "2rem",
            }}
          >
            <StatCard label="Total analyzed"   value={decisions.length} icon={Brain}        color="var(--color-amber)" />
            <StatCard label="Choices recorded"  value={decided}         icon={CheckCircle2}  color="var(--color-sage)" />
            <StatCard label="Outcomes tracked"  value={tracked}         icon={TrendingUp}    color="var(--color-sky)" />
            <StatCard label="Avg. confidence"   value={decisions.length ? `${avgConf}%` : "—"} icon={BookOpen} color="var(--color-rose)" sub="AI analysis score" />
          </div>

          {/* Content */}
          {loading ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: "1rem",
              }}
            >
              {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
            </div>
          ) : decisions.length === 0 ? (
            /* Empty state */
            <div
              style={{
                textAlign: "center",
                padding: "clamp(2rem, 8vw, 5rem) clamp(1rem, 4vw, 2rem)",
                border: "1.5px dashed var(--color-border-strong)",
                borderRadius: "var(--radius-xl)",
                background: "var(--color-surface-raised)",
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "var(--radius-full)",
                  background: "var(--color-surface-alt)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1.25rem",
                }}
              >
                <Brain size={26} color="var(--color-border-strong)" strokeWidth={1.5} />
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(1.1rem, 4vw, 1.4rem)",
                  fontWeight: 700,
                  color: "var(--color-ink)",
                  marginBottom: "0.5rem",
                }}
              >
                No decisions yet
              </h3>
              <p
                style={{
                  color: "var(--color-ink-muted)",
                  fontSize: "0.9rem",
                  marginBottom: "1.5rem",
                  maxWidth: 360,
                  margin: "0 auto 1.5rem",
                  lineHeight: 1.65,
                }}
              >
                Analyze your first high-stakes decision and get a clear, unbiased recommendation in under 30 seconds.
              </p>
              <Link
                href="/decision/new"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.75rem 1.5rem",
                  background: "var(--color-amber)",
                  color: "white",
                  borderRadius: "var(--radius-md)",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  textDecoration: "none",
                  minHeight: 44,
                }}
              >
                <Sparkles size={15} />
                Analyze your first decision
              </Link>
            </div>
          ) : (
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "1rem",
                  flexWrap: "wrap",
                  gap: "0.5rem",
                }}
              >
                <h2
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    color: "var(--color-ink)",
                  }}
                >
                  Recent Decisions
                </h2>
                <Link
                  href="/journal"
                  style={{ fontSize: "0.82rem", color: "var(--color-amber)", fontWeight: 500 }}
                >
                  View all in journal →
                </Link>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 340px), 1fr))",
                  gap: "1rem",
                }}
              >
                {decisions.slice(0, 9).map((d) => (
                  <DecisionCard key={d.id} decision={d} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

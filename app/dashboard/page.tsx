"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Toasts from "@/components/ui/Toasts";
import PageHeader from "@/components/ui/PageHeader";
import EmptyState from "@/components/ui/EmptyState";
import StatTile from "@/components/ui/StatTile";
import DecisionRow from "@/components/decision/DecisionRow";
import type { Decision } from "@/types";
import { Plus, Scale, CheckCircle2, TrendingUp, Gauge, ArrowRight } from "lucide-react";

function RowSkeleton() {
  return (
    <div style={{ padding: "1.15rem 1.5rem", borderBottom: "1px solid var(--color-border)" }}>
      <div className="skeleton" style={{ height: 12, width: 90, marginBottom: 10 }} />
      <div className="skeleton" style={{ height: 16, width: "55%", marginBottom: 8 }} />
      <div className="skeleton" style={{ height: 12, width: "80%" }} />
    </div>
  );
}

export default function DashboardPage() {
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [loading, setLoading] = useState(true);
  const [usage, setUsage] = useState<{ remaining: number | null; limit: number | null }>({
    remaining: null,
    limit: null,
  });

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/decisions");
        if (res.ok) {
          const data = (await res.json()) as { decisions: Decision[] };
          setDecisions(data.decisions);
        }
      } finally {
        setLoading(false);
      }
    })();

    fetch("/api/usage")
      .then((r) => r.json())
      .then((d) => setUsage({ remaining: d.remaining, limit: d.limit }))
      .catch(() => {});
  }, []);

  const decided = decisions.filter((d) => d.status === "decided" || d.status === "tracking").length;
  const tracked = decisions.filter((d) => d.status === "tracking").length;
  const avgConf =
    decisions.length > 0
      ? Math.round(decisions.reduce((s, d) => s + (d.analysis?.confidenceScore ?? 0), 0) / decisions.length)
      : 0;

  const awaiting = decisions.filter((d) => d.status === "analyzed");
  const recent = decisions.slice(0, 6);

  return (
    <>
      <Navbar />
      <Toasts />

      <main className="app-body">
        <div className="app-container">
          <PageHeader
            title="Dashboard"
            description="Your decisions, the choices you recorded, and how they turned out."
            action={
              <Link href="/decision/new" className="btn btn-primary">
                <Plus size={15} strokeWidth={2.4} />
                New decision
              </Link>
            }
          />

          {/* Overview */}
          <section aria-label="Overview" style={{ marginBottom: "2rem" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 190px), 1fr))",
                gap: "0.75rem",
              }}
            >
              <StatTile label="Decisions analyzed" value={loading ? "—" : decisions.length} icon={Scale} />
              <StatTile label="Choices recorded" value={loading ? "—" : decided} icon={CheckCircle2} />
              <StatTile label="Outcomes tracked" value={loading ? "—" : tracked} icon={TrendingUp} />
              <StatTile
                label="Average confidence"
                value={loading ? "—" : decisions.length ? `${avgConf}%` : "—"}
                sub={decisions.length ? "across your analyses" : undefined}
                icon={Gauge}
              />
            </div>
          </section>

          {/* Awaiting a decision — the actionable nudge */}
          {!loading && awaiting.length > 0 && (
            <section
              className="panel"
              style={{
                padding: "1.1rem 1.35rem",
                marginBottom: "2rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "1rem",
                flexWrap: "wrap",
                borderLeft: "2px solid var(--color-amber)",
              }}
            >
              <div style={{ minWidth: 0 }}>
                <p style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--color-ink)", marginBottom: "0.2rem" }}>
                  {awaiting.length} {awaiting.length === 1 ? "analysis is" : "analyses are"} waiting on your call
                </p>
                <p className="meta">
                  Recording what you chose is what makes the outcome worth tracking later.
                </p>
              </div>
              <Link href={`/decision/${awaiting[0].id}`} className="btn btn-ghost btn-sm">
                Review
                <ArrowRight size={14} />
              </Link>
            </section>
          )}

          {/* Recent decisions */}
          <section aria-label="Recent decisions">
            <div className="panel" style={{ overflow: "hidden" }}>
              <div className="panel-header">
                <div>
                  <h2 className="panel-title">Recent decisions</h2>
                  {!loading && decisions.length > 0 && (
                    <p className="meta" style={{ marginTop: "0.2rem" }}>
                      Showing {Math.min(recent.length, decisions.length)} of {decisions.length}
                    </p>
                  )}
                </div>
                {decisions.length > recent.length && (
                  <Link href="/journal" className="link-quiet" style={{ fontSize: "var(--text-xs)", whiteSpace: "nowrap" }}>
                    View all
                  </Link>
                )}
              </div>

              {loading ? (
                <>
                  <RowSkeleton />
                  <RowSkeleton />
                  <RowSkeleton />
                </>
              ) : decisions.length === 0 ? (
                <div style={{ padding: "clamp(1.5rem, 5vw, 2.5rem)" }}>
                  <EmptyState
                    icon={Scale}
                    title="No decisions yet"
                    description="Describe a decision you're weighing and Clarity will structure it — the trade-offs, what's still unknown, and what would change the answer."
                    hints={[
                      "Describe the decision and the options you're weighing",
                      "Add the context and constraints that actually matter",
                      "Read the recommendation, then record what you chose",
                    ]}
                    action={
                      <Link href="/decision/new" className="btn btn-primary">
                        <Plus size={15} strokeWidth={2.4} />
                        Analyze your first decision
                      </Link>
                    }
                  />
                </div>
              ) : (
                <div>
                  {recent.map((d) => (
                    <DecisionRow key={d.id} decision={d} />
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Usage footnote — understated, never a quota dashboard */}
          {usage.remaining !== null && usage.limit !== null && usage.limit > 0 && (
            <p className="meta" style={{ marginTop: "1rem", textAlign: "right" }}>
              {usage.remaining} of {usage.limit} {usage.limit === 1 ? "analysis" : "analyses"} remaining today
            </p>
          )}
        </div>
      </main>
    </>
  );
}

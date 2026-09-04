"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Toasts from "@/components/ui/Toasts";
import PageHeader from "@/components/ui/PageHeader";
import EmptyState from "@/components/ui/EmptyState";
import DecisionRow from "@/components/decision/DecisionRow";
import type { Decision, DecisionCategory, DecisionStake } from "@/types";
import { BookOpen, Plus, Search, X } from "lucide-react";

const STATUSES: { value: string; label: string }[] = [
  { value: "all", label: "All" },
  { value: "analyzed", label: "Awaiting call" },
  { value: "decided", label: "Decided" },
  { value: "tracking", label: "Tracking" },
];

const STAKES: { value: DecisionStake | "all"; label: string }[] = [
  { value: "all", label: "Any stake" },
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "critical", label: "Critical" },
];

function RowSkeleton() {
  return (
    <div style={{ padding: "1.15rem 1.5rem", borderBottom: "1px solid var(--color-border)" }}>
      <div className="skeleton" style={{ height: 12, width: 120, marginBottom: 10 }} />
      <div className="skeleton" style={{ height: 16, width: "50%", marginBottom: 8 }} />
      <div className="skeleton" style={{ height: 12, width: "70%" }} />
    </div>
  );
}

export default function JournalPage() {
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [categoryFilter, setCatFilter] = useState<DecisionCategory | "all">("all");
  const [stakeFilter, setStakeFilter] = useState<DecisionStake | "all">("all");
  const [statusFilter, setStatusFilter] = useState("all");

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
  }, []);

  const categories = useMemo(() => {
    const counts = decisions.reduce<Record<string, number>>((acc, d) => {
      acc[d.intake.category] = (acc[d.intake.category] ?? 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [decisions]);

  const filtered = decisions.filter((d) => {
    const q = query.trim().toLowerCase();
    const matchesQuery =
      !q ||
      d.intake.title.toLowerCase().includes(q) ||
      d.intake.description.toLowerCase().includes(q);
    const matchesCat = categoryFilter === "all" || d.intake.category === categoryFilter;
    const matchesStake = stakeFilter === "all" || d.intake.stake === stakeFilter;
    const matchesStatus = statusFilter === "all" || d.status === statusFilter;
    return matchesQuery && matchesCat && matchesStake && matchesStatus;
  });

  const filtersActive =
    Boolean(query.trim()) || categoryFilter !== "all" || stakeFilter !== "all" || statusFilter !== "all";

  function clearFilters() {
    setQuery("");
    setCatFilter("all");
    setStakeFilter("all");
    setStatusFilter("all");
  }

  return (
    <>
      <Navbar />
      <Toasts />

      <main className="app-body">
        <div className="app-container">
          <PageHeader
            title="Journal"
            description="Every decision you've analyzed, what you chose, and how it turned out."
            action={
              <Link href="/decision/new" className="btn btn-primary">
                <Plus size={15} strokeWidth={2.4} />
                New decision
              </Link>
            }
          >
            {/* Controls */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", alignItems: "center" }}>
                <div style={{ position: "relative", flex: "1 1 260px", minWidth: 0 }}>
                  <Search
                    size={15}
                    color="var(--color-ink-faint)"
                    style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}
                    aria-hidden
                  />
                  <input
                    className="input-field"
                    placeholder="Search decisions"
                    aria-label="Search decisions"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    style={{ paddingLeft: 36, minHeight: 40 }}
                  />
                </div>

                <div className="segmented" role="group" aria-label="Filter by status">
                  {STATUSES.map((s) => (
                    <button
                      key={s.value}
                      aria-pressed={statusFilter === s.value}
                      onClick={() => setStatusFilter(s.value)}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {(categories.length > 0 || filtersActive) && (
                <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", alignItems: "center" }}>
                  <button
                    className="chip"
                    aria-pressed={categoryFilter === "all"}
                    onClick={() => setCatFilter("all")}
                  >
                    All categories
                  </button>
                  {categories.map(([cat, count]) => (
                    <button
                      key={cat}
                      className="chip"
                      aria-pressed={categoryFilter === cat}
                      onClick={() => setCatFilter(cat as DecisionCategory)}
                      style={{ textTransform: "capitalize" }}
                    >
                      {cat}
                      <span style={{ opacity: 0.6 }}>{count}</span>
                    </button>
                  ))}

                  <span aria-hidden style={{ width: 1, height: 18, background: "var(--color-border)", margin: "0 0.2rem" }} />

                  <select
                    aria-label="Filter by stake"
                    value={stakeFilter}
                    onChange={(e) => setStakeFilter(e.target.value as DecisionStake | "all")}
                    className="chip"
                    style={{ appearance: "none", paddingRight: "1.6rem" }}
                  >
                    {STAKES.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>

                  {filtersActive && (
                    <button className="chip" onClick={clearFilters}>
                      <X size={12} />
                      Clear
                    </button>
                  )}
                </div>
              )}
            </div>
          </PageHeader>

          {/* Results */}
          <div className="panel" style={{ overflow: "hidden" }}>
            <div className="panel-header">
              <h2 className="panel-title">
                {loading
                  ? "Loading"
                  : filtersActive
                  ? `${filtered.length} ${filtered.length === 1 ? "result" : "results"}`
                  : `${decisions.length} ${decisions.length === 1 ? "decision" : "decisions"}`}
              </h2>
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
                  icon={BookOpen}
                  title="Your journal is empty"
                  description="Once you analyze a decision it's saved here, along with the choice you made and how it played out."
                  action={
                    <Link href="/decision/new" className="btn btn-primary">
                      <Plus size={15} strokeWidth={2.4} />
                      Analyze a decision
                    </Link>
                  }
                />
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ padding: "clamp(1.5rem, 5vw, 2.5rem)" }}>
                <EmptyState
                  icon={Search}
                  title="No decisions match these filters"
                  description="Try a different search term, or clear the filters to see everything in your journal."
                  action={
                    <button onClick={clearFilters} className="btn btn-ghost">
                      Clear filters
                    </button>
                  }
                />
              </div>
            ) : (
              <div>
                {filtered.map((d) => (
                  <DecisionRow key={d.id} decision={d} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

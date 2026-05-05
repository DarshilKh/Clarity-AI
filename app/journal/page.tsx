"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Toasts from "@/components/ui/Toasts";
import DecisionCard from "@/components/decision/DecisionCard";
import type { Decision, DecisionCategory, DecisionStake } from "@/types";
import { BookOpen, Loader2, Search, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { categoryEmoji } from "@/lib/utils";

const CATEGORIES: { value: DecisionCategory | "all"; label: string }[] = [
  { value: "all",          label: "All" },
  { value: "career",       label: "Career" },
  { value: "financial",    label: "Financial" },
  { value: "relationship", label: "Relationship" },
  { value: "health",       label: "Health" },
  { value: "education",    label: "Education" },
  { value: "relocation",   label: "Relocation" },
  { value: "business",     label: "Business" },
  { value: "other",        label: "Other" },
];

const STAKES: { value: DecisionStake | "all"; label: string }[] = [
  { value: "all",      label: "Any stake" },
  { value: "low",      label: "Low" },
  { value: "medium",   label: "Medium" },
  { value: "high",     label: "High" },
  { value: "critical", label: "Critical" },
];

const STATUSES = [
  { value: "all",      label: "All statuses" },
  { value: "analyzed", label: "Analyzed" },
  { value: "decided",  label: "Decided" },
  { value: "tracking", label: "Tracking" },
];

export default function JournalPage() {
  const [decisions, setDecisions]     = useState<Decision[]>([]);
  const [loading, setLoading]         = useState(true);
  const [query, setQuery]             = useState("");
  const [categoryFilter, setCatFilter]= useState<DecisionCategory | "all">("all");
  const [stakeFilter, setStakeFilter] = useState<DecisionStake | "all">("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/decisions");
        if (res.ok) {
          const data = (await res.json()) as { decisions: Decision[] };
          setDecisions(data.decisions);
        }
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = decisions.filter((d) => {
    const matchesQuery =
      !query.trim() ||
      d.intake.title.toLowerCase().includes(query.toLowerCase()) ||
      d.intake.description.toLowerCase().includes(query.toLowerCase());
    const matchesCat    = categoryFilter === "all" || d.intake.category === categoryFilter;
    const matchesStake  = stakeFilter   === "all" || d.intake.stake    === stakeFilter;
    const matchesStatus = statusFilter  === "all" || d.status          === statusFilter;
    return matchesQuery && matchesCat && matchesStake && matchesStatus;
  });

  // Stats for sidebar
  const totalDecisions = decisions.length;
  const categoryCounts = decisions.reduce<Record<string, number>>((acc, d) => {
    acc[d.intake.category] = (acc[d.intake.category] ?? 0) + 1;
    return acc;
  }, {});
  const topCategories = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  return (
    <>
      <Navbar />
      <Toasts />

      <div style={{ minHeight: "calc(100dvh - 64px)", background: "var(--color-surface)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2.5rem 1.5rem" }}>

          {/* Header */}
          <div style={{ marginBottom: "2rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "0.4rem" }}>
              <BookOpen size={22} color="var(--color-amber)" strokeWidth={2} />
              <h1
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "2rem",
                  fontWeight: 800,
                  color: "var(--color-ink)",
                  letterSpacing: "-0.03em",
                }}
              >
                Decision Journal
              </h1>
            </div>
            <p style={{ color: "var(--color-ink-muted)", fontSize: "0.9rem" }}>
              Your full history of decisions, analyses, and outcomes in one place.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 260px", gap: "1.75rem", alignItems: "start" }}>
            {/* Main content */}
            <div>
              {/* Search + filter bar */}
              <div style={{ display: "flex", gap: "0.625rem", marginBottom: "1rem", alignItems: "center" }}>
                <div style={{ flex: 1, position: "relative" }}>
                  <Search
                    size={15}
                    color="var(--color-border-strong)"
                    style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}
                  />
                  <input
                    className="input-field"
                    placeholder="Search decisions…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    style={{ paddingLeft: "2.25rem" }}
                  />
                </div>
                <button
                  onClick={() => setShowFilters((v) => !v)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.375rem",
                    padding: "0.65rem 1rem",
                    borderRadius: "var(--radius-md)",
                    border: showFilters ? "1px solid var(--color-amber)" : "1px solid var(--color-border)",
                    background: showFilters ? "var(--color-amber-pale)" : "var(--color-surface-raised)",
                    color: showFilters ? "var(--color-amber)" : "var(--color-ink-muted)",
                    fontSize: "0.85rem",
                    fontWeight: 500,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  <SlidersHorizontal size={14} />
                  Filters
                </button>
              </div>

              {/* Filter dropdowns */}
              {showFilters && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: "0.625rem",
                    marginBottom: "1.25rem",
                    padding: "1rem",
                    background: "var(--color-surface-raised)",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--color-border)",
                  }}
                >
                  <div>
                    <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "var(--color-ink-muted)", marginBottom: "0.35rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      Category
                    </label>
                    <select
                      className="input-field"
                      value={categoryFilter}
                      onChange={(e) => setCatFilter(e.target.value as DecisionCategory | "all")}
                      style={{ padding: "0.5rem 0.75rem" }}
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "var(--color-ink-muted)", marginBottom: "0.35rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      Stakes
                    </label>
                    <select
                      className="input-field"
                      value={stakeFilter}
                      onChange={(e) => setStakeFilter(e.target.value as DecisionStake | "all")}
                      style={{ padding: "0.5rem 0.75rem" }}
                    >
                      {STAKES.map((s) => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "var(--color-ink-muted)", marginBottom: "0.35rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      Status
                    </label>
                    <select
                      className="input-field"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      style={{ padding: "0.5rem 0.75rem" }}
                    >
                      {STATUSES.map((s) => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Results count */}
              {!loading && (
                <p style={{ fontSize: "0.8rem", color: "var(--color-ink-faint)", marginBottom: "0.875rem" }}>
                  {filtered.length} decision{filtered.length !== 1 ? "s" : ""}
                  {query || categoryFilter !== "all" || stakeFilter !== "all" || statusFilter !== "all"
                    ? " matching filters"
                    : " total"}
                </p>
              )}

              {/* Cards */}
              {loading ? (
                <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", padding: "3rem 0", color: "var(--color-ink-muted)" }}>
                  <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} />
                  <span style={{ fontSize: "0.875rem" }}>Loading journal…</span>
                </div>
              ) : filtered.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "4rem 2rem",
                    border: "1.5px dashed var(--color-border-strong)",
                    borderRadius: "var(--radius-xl)",
                    background: "var(--color-surface-raised)",
                  }}
                >
                  <BookOpen size={36} color="var(--color-border-strong)" strokeWidth={1.5} style={{ margin: "0 auto 1rem" }} />
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.15rem", fontWeight: 700, color: "var(--color-ink)", marginBottom: "0.4rem" }}>
                    {decisions.length === 0 ? "Your journal is empty" : "No results found"}
                  </h3>
                  <p style={{ color: "var(--color-ink-muted)", fontSize: "0.875rem", marginBottom: "1.25rem" }}>
                    {decisions.length === 0
                      ? "Every decision you analyze will be saved here automatically."
                      : "Try adjusting your search or filters."}
                  </p>
                  {decisions.length === 0 && (
                    <Link
                      href="/decision/new"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.375rem",
                        padding: "0.6rem 1.25rem",
                        background: "var(--color-amber)",
                        color: "white",
                        borderRadius: "var(--radius-md)",
                        fontWeight: 600,
                        fontSize: "0.875rem",
                        textDecoration: "none",
                      }}
                    >
                      Make your first decision
                    </Link>
                  )}
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
                  {filtered.map((d) => (
                    <DecisionCard key={d.id} decision={d} />
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", position: "sticky", top: "5rem" }}>
              {/* Summary card */}
              <div className="card">
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "0.95rem", fontWeight: 700, color: "var(--color-ink)", marginBottom: "1rem" }}>
                  Journal Summary
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                  {[
                    { label: "Total analyzed",    value: totalDecisions },
                    { label: "Choices recorded",  value: decisions.filter((d) => d.status === "decided" || d.status === "tracking").length },
                    { label: "Outcomes tracked",  value: decisions.filter((d) => d.status === "tracking").length },
                    {
                      label: "Avg. confidence",
                      value: totalDecisions > 0
                        ? `${Math.round(decisions.reduce((s, d) => s + (d.analysis?.confidenceScore ?? 0), 0) / totalDecisions)}%`
                        : "—",
                    },
                  ].map(({ label, value }) => (
                    <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "0.8rem", color: "var(--color-ink-muted)" }}>{label}</span>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.875rem", fontWeight: 700, color: "var(--color-ink)" }}>
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top categories */}
              {topCategories.length > 0 && (
                <div className="card">
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: "0.95rem", fontWeight: 700, color: "var(--color-ink)", marginBottom: "1rem" }}>
                    Top Categories
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {topCategories.map(([cat, count]) => (
                      <div
                        key={cat}
                        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}
                        onClick={() => setCatFilter(cat as DecisionCategory)}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                          <span style={{ fontSize: "0.9rem" }}>{categoryEmoji(cat)}</span>
                          <span style={{ fontSize: "0.8rem", color: "var(--color-ink-soft)", textTransform: "capitalize" }}>{cat}</span>
                        </div>
                        <span
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            padding: "0.15rem 0.45rem",
                            borderRadius: "var(--radius-full)",
                            background: "var(--color-surface-alt)",
                            color: "var(--color-ink-muted)",
                          }}
                        >
                          {count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA */}
              <Link
                href="/decision/new"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.4rem",
                  padding: "0.75rem",
                  background: "var(--color-ink)",
                  color: "white",
                  borderRadius: "var(--radius-md)",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  textDecoration: "none",
                  textAlign: "center",
                }}
              >
                + New Decision
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

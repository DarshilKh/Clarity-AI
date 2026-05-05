"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Toasts from "@/components/ui/Toasts";
import AnalysisResults from "@/components/decision/AnalysisResults";
import OutcomeTracker from "@/components/decision/OutcomeTracker";
import type { Decision } from "@/types";
import { useToastStore } from "@/store";
import {
  Loader2,
  ArrowLeft,
  CheckCircle2,
  BarChart2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { categoryEmoji, stakeColor, stakeLabel, formatDate } from "@/lib/utils";
import Link from "next/link";

export default function DecisionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { addToast } = useToastStore();

  const [decision, setDecision]       = useState<Decision | null>(null);
  const [loading, setLoading]         = useState(true);
  const [showAnalysis, setShowAnalysis] = useState(true);
  const [showTracker, setShowTracker] = useState(false);
  const [choosingOption, setChoosingOption] = useState(false);
  const [chosenId, setChosenId]       = useState<string | null>(null);
  const [reasoning, setReasoning]     = useState("");
  const [savingChoice, setSavingChoice] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        // Use the proper GET by ID endpoint now
        const res = await fetch(`/api/decisions/${id}`);
        if (res.status === 401) {
          router.push("/auth/login");
          return;
        }
        if (res.status === 404 || !res.ok) {
          addToast("error", "Decision not found");
          router.push("/dashboard");
          return;
        }
        const data = (await res.json()) as { decision: Decision };
        setDecision(data.decision);
        setChosenId(data.decision.chosenOptionId);
      } catch {
        addToast("error", "Could not load decision");
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  async function recordChoice() {
    if (!chosenId || !decision) return;
    setSavingChoice(true);
    try {
      const res = await fetch(`/api/decisions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chosenOptionId: chosenId, reasoning }),
      });
      if (!res.ok) throw new Error("Failed to save");
      setDecision((d) =>
        d ? { ...d, status: "decided", chosenOptionId: chosenId, chosenReasoning: reasoning } : d
      );
      setChoosingOption(false);
      addToast("success", "Choice recorded! Come back in 30 days to track the outcome.");
    } catch {
      addToast("error", "Could not save choice");
    } finally {
      setSavingChoice(false);
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "calc(100dvh - 60px)",
            gap: "0.875rem",
            color: "var(--color-ink-muted)",
          }}
        >
          <Loader2 size={24} style={{ animation: "spin 1s linear infinite" }} />
          <p style={{ fontSize: "0.875rem" }}>Loading decision…</p>
        </div>
      </>
    );
  }

  if (!decision) return null;

  const { intake, analysis, status, chosenOptionId, chosenReasoning, createdAt } = decision;
  const chosenOption  = intake.options.find((o) => o.id === chosenOptionId);
  const recommended   = intake.options.find((o) => o.id === analysis?.recommendedOptionId);

  return (
    <>
      <Navbar />
      <Toasts />

      <div style={{ minHeight: "calc(100dvh - 60px)", background: "var(--color-surface)" }}>
        <div className="page-wrap-narrow">

          {/* Back */}
          <Link
            href="/dashboard"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.375rem",
              fontSize: "0.82rem",
              color: "var(--color-ink-muted)",
              marginBottom: "1.25rem",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            <ArrowLeft size={14} />
            Dashboard
          </Link>

          {/* Header card */}
          <div className="card" style={{ marginBottom: "1.25rem" }}>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "0.75rem",
                marginBottom: "1rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                <span style={{ fontSize: "1.4rem" }}>{categoryEmoji(intake.category)}</span>
                <span className={`badge ${stakeColor(intake.stake)}`}>{stakeLabel(intake.stake)}</span>
                {status === "decided" && (
                  <span className="badge badge-sage" style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
                    <CheckCircle2 size={10} /> Decided
                  </span>
                )}
                {status === "tracking" && (
                  <span className="badge badge-sky" style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
                    <BarChart2 size={10} /> Tracking
                  </span>
                )}
              </div>
              <span style={{ fontSize: "0.75rem", color: "var(--color-ink-faint)", flexShrink: 0 }}>
                {formatDate(createdAt)}
              </span>
            </div>

            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.2rem, 4vw, 1.6rem)",
                fontWeight: 800,
                color: "var(--color-ink)",
                letterSpacing: "-0.03em",
                marginBottom: "0.6rem",
                lineHeight: 1.25,
              }}
            >
              {intake.title}
            </h1>

            <p
              style={{
                fontSize: "0.875rem",
                color: "var(--color-ink-muted)",
                lineHeight: 1.65,
                marginBottom: "1rem",
              }}
            >
              {intake.description}
            </p>

            {/* Option chips */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
              {intake.options.map((opt) => (
                <span
                  key={opt.id}
                  style={{
                    padding: "0.25rem 0.75rem",
                    borderRadius: "var(--radius-full)",
                    background:
                      opt.id === chosenOptionId
                        ? "var(--color-sage-pale)"
                        : opt.id === analysis?.recommendedOptionId
                        ? "var(--color-amber-pale)"
                        : "var(--color-surface-alt)",
                    border: `1px solid ${
                      opt.id === chosenOptionId
                        ? "var(--color-sage-border)"
                        : opt.id === analysis?.recommendedOptionId
                        ? "var(--color-amber-border)"
                        : "var(--color-border)"
                    }`,
                    fontSize: "0.78rem",
                    fontWeight: 500,
                    color:
                      opt.id === chosenOptionId
                        ? "var(--color-sage)"
                        : opt.id === analysis?.recommendedOptionId
                        ? "var(--color-amber)"
                        : "var(--color-ink-muted)",
                  }}
                >
                  {opt.id === chosenOptionId ? "✓ " : opt.id === analysis?.recommendedOptionId ? "★ " : ""}
                  {opt.label}
                </span>
              ))}
            </div>
          </div>

          {/* Chosen banner */}
          {chosenOption && (
            <div
              style={{
                background: "var(--color-sage-pale)",
                border: "1px solid var(--color-sage-border)",
                borderRadius: "var(--radius-md)",
                padding: "0.875rem 1.125rem",
                marginBottom: "1.25rem",
                display: "flex",
                gap: "0.625rem",
                alignItems: "flex-start",
              }}
            >
              <CheckCircle2 size={17} color="var(--color-sage)" strokeWidth={2} style={{ flexShrink: 0, marginTop: 1 }} />
              <div>
                <p style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--color-sage)", marginBottom: "0.2rem" }}>
                  You chose: {chosenOption.label}
                </p>
                {chosenReasoning && (
                  <p style={{ fontSize: "0.8rem", color: "var(--color-ink-muted)", fontStyle: "italic" }}>
                    &ldquo;{chosenReasoning}&rdquo;
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Record choice prompt */}
          {status === "analyzed" && (
            <div
              style={{
                background: "var(--color-amber-pale)",
                border: "1px solid var(--color-amber-border)",
                borderRadius: "var(--radius-lg)",
                padding: "1.125rem",
                marginBottom: "1.25rem",
              }}
            >
              {!choosingOption ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
                  <div>
                    <p style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--color-ink)", marginBottom: "0.15rem" }}>
                      Ready to decide?
                    </p>
                    <p style={{ fontSize: "0.8rem", color: "var(--color-ink-muted)" }}>
                      {recommended ? `AI recommends: ${recommended.label}` : "Record your final choice."}
                    </p>
                  </div>
                  <button
                    onClick={() => setChoosingOption(true)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      padding: "0.6rem 1.1rem",
                      background: "var(--color-amber)",
                      color: "white",
                      border: "none",
                      borderRadius: "var(--radius-md)",
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      cursor: "pointer",
                      minHeight: 44,
                      whiteSpace: "nowrap",
                    }}
                  >
                    <CheckCircle2 size={14} />
                    Record choice
                  </button>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
                  <p style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--color-ink)" }}>
                    Which option did you choose?
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {intake.options.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setChosenId(opt.id)}
                        style={{
                          padding: "0.75rem 1rem",
                          borderRadius: "var(--radius-md)",
                          border: chosenId === opt.id ? "2px solid var(--color-amber)" : "1px solid var(--color-border)",
                          background: chosenId === opt.id ? "white" : "var(--color-surface-raised)",
                          cursor: "pointer",
                          textAlign: "left",
                          fontWeight: chosenId === opt.id ? 700 : 400,
                          color: chosenId === opt.id ? "var(--color-amber)" : "var(--color-ink)",
                          fontSize: "0.875rem",
                          transition: "all 0.15s ease",
                          minHeight: 44,
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--color-ink-muted)", marginBottom: "0.35rem" }}>
                      Why did you choose this? (optional)
                    </label>
                    <textarea
                      className="input-field"
                      rows={2}
                      placeholder="What tipped the balance?"
                      value={reasoning}
                      onChange={(e) => setReasoning(e.target.value)}
                    />
                  </div>
                  <div style={{ display: "flex", gap: "0.625rem" }}>
                    <button
                      onClick={recordChoice}
                      disabled={!chosenId || savingChoice}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.4rem",
                        padding: "0.6rem 1.1rem",
                        background: "var(--color-amber)",
                        color: "white",
                        border: "none",
                        borderRadius: "var(--radius-md)",
                        fontWeight: 600,
                        fontSize: "0.875rem",
                        cursor: !chosenId || savingChoice ? "not-allowed" : "pointer",
                        opacity: !chosenId || savingChoice ? 0.6 : 1,
                        minHeight: 44,
                      }}
                    >
                      {savingChoice
                        ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />
                        : <CheckCircle2 size={14} />}
                      Confirm
                    </button>
                    <button
                      onClick={() => setChoosingOption(false)}
                      style={{
                        padding: "0.6rem 1rem",
                        background: "transparent",
                        border: "1px solid var(--color-border)",
                        borderRadius: "var(--radius-md)",
                        fontSize: "0.875rem",
                        color: "var(--color-ink-muted)",
                        cursor: "pointer",
                        minHeight: 44,
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Analysis accordion */}
          {analysis && (
            <div style={{ marginBottom: "1rem" }}>
              <button
                onClick={() => setShowAnalysis((v) => !v)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  padding: "0.875rem 1.125rem",
                  background: "var(--color-surface-raised)",
                  border: "1px solid var(--color-border)",
                  borderRadius: showAnalysis ? "var(--radius-lg) var(--radius-lg) 0 0" : "var(--radius-lg)",
                  cursor: "pointer",
                  fontFamily: "var(--font-display)",
                  fontSize: "1rem",
                  fontWeight: 700,
                  color: "var(--color-ink)",
                  minHeight: 48,
                }}
              >
                <span>Full AI Analysis</span>
                {showAnalysis ? <ChevronUp size={17} /> : <ChevronDown size={17} />}
              </button>
              {showAnalysis && (
                <div
                  style={{
                    border: "1px solid var(--color-border)",
                    borderTop: "none",
                    borderRadius: "0 0 var(--radius-lg) var(--radius-lg)",
                    padding: "clamp(1rem, 4vw, 1.5rem)",
                    background: "var(--color-surface)",
                  }}
                >
                  <AnalysisResults analysis={analysis} intake={intake} />
                </div>
              )}
            </div>
          )}

          {/* Outcome tracker accordion */}
          {(status === "decided" || status === "tracking") && (
            <div style={{ marginBottom: "1rem" }}>
              <button
                onClick={() => setShowTracker((v) => !v)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  padding: "0.875rem 1.125rem",
                  background: "var(--color-surface-raised)",
                  border: "1px solid var(--color-border)",
                  borderRadius: showTracker ? "var(--radius-lg) var(--radius-lg) 0 0" : "var(--radius-lg)",
                  cursor: "pointer",
                  fontFamily: "var(--font-display)",
                  fontSize: "1rem",
                  fontWeight: 700,
                  color: "var(--color-ink)",
                  minHeight: 48,
                }}
              >
                <span>Outcome Tracking</span>
                {showTracker ? <ChevronUp size={17} /> : <ChevronDown size={17} />}
              </button>
              {showTracker && (
                <div
                  style={{
                    border: "1px solid var(--color-border)",
                    borderTop: "none",
                    borderRadius: "0 0 var(--radius-lg) var(--radius-lg)",
                    padding: "clamp(1rem, 4vw, 1.5rem)",
                    background: "var(--color-surface)",
                  }}
                >
                  <OutcomeTracker decision={decision} onUpdate={(d) => setDecision(d)} />
                </div>
              )}
            </div>
          )}

          {/* Bottom padding for mobile */}
          <div style={{ height: "2rem" }} />
        </div>
      </div>
    </>
  );
}

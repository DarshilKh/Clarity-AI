"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Toasts from "@/components/ui/Toasts";
import PageHeader from "@/components/ui/PageHeader";
import AnalysisResults from "@/components/decision/AnalysisResults";
import OutcomeTracker from "@/components/decision/OutcomeTracker";
import type { Decision } from "@/types";
import { useToastStore } from "@/store";
import { Loader2, Check, ChevronDown } from "lucide-react";
import { stakeColor, stakeLabel, formatDate, categoryLabel } from "@/lib/utils";
import { categoryIcon } from "@/lib/categories";

function Collapsible({
  title,
  subtitle,
  defaultOpen = false,
  children,
}: {
  title: string;
  subtitle?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="panel" style={{ overflow: "hidden" }}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          width: "100%",
          padding: "1rem clamp(1.1rem, 3vw, 1.5rem)",
          background: "transparent",
          border: "none",
          borderBottom: open ? "1px solid var(--color-border)" : "none",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <span>
          <span className="panel-title" style={{ display: "block" }}>
            {title}
          </span>
          {subtitle && (
            <span className="meta" style={{ display: "block", marginTop: "0.2rem" }}>
              {subtitle}
            </span>
          )}
        </span>
        <ChevronDown
          size={17}
          color="var(--color-ink-faint)"
          style={{ flexShrink: 0, transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s ease" }}
        />
      </button>
      {open && <div style={{ padding: "clamp(1.1rem, 3vw, 1.5rem)" }}>{children}</div>}
    </section>
  );
}

export default function DecisionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { addToast } = useToastStore();

  const [decision, setDecision] = useState<Decision | null>(null);
  const [loading, setLoading] = useState(true);
  const [choosingOption, setChoosingOption] = useState(false);
  const [chosenId, setChosenId] = useState<string | null>(null);
  const [reasoning, setReasoning] = useState("");
  const [savingChoice, setSavingChoice] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/decisions/${id}`);
        if (res.status === 401) {
          router.push("/auth/login");
          return;
        }
        if (!res.ok) {
          addToast("error", "That decision could not be found.");
          router.push("/journal");
          return;
        }
        const data = (await res.json()) as { decision: Decision };
        setDecision(data.decision);
        setChosenId(data.decision.chosenOptionId);
      } catch {
        addToast("error", "Could not load this decision.");
        router.push("/journal");
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      addToast("success", "Choice recorded. You can track the outcome from here.");
    } catch {
      addToast("error", "Could not save your choice. Please try again.");
    } finally {
      setSavingChoice(false);
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="app-body">
          <div className="app-container-narrow">
            <div className="skeleton" style={{ height: 14, width: 90, marginBottom: 20 }} />
            <div className="skeleton" style={{ height: 30, width: "70%", marginBottom: 14 }} />
            <div className="skeleton" style={{ height: 14, width: "90%", marginBottom: 8 }} />
            <div className="skeleton" style={{ height: 14, width: "60%", marginBottom: 32 }} />
            <div className="skeleton" style={{ height: 180, width: "100%", borderRadius: 16 }} />
          </div>
        </main>
      </>
    );
  }

  if (!decision) return null;

  const { intake, analysis, status, chosenOptionId, chosenReasoning, createdAt } = decision;
  const chosenOption = intake.options.find((o) => o.id === chosenOptionId);
  const recommended = intake.options.find((o) => o.id === analysis?.recommendedOptionId);
  const CategoryIcon = categoryIcon(intake.category);

  return (
    <>
      <Navbar />
      <Toasts />

      <main className="app-body">
        <div className="app-container-narrow">
          <PageHeader
            backHref="/journal"
            backLabel="Journal"
            title={intake.title}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.55rem", flexWrap: "wrap" }}>
              <CategoryIcon size={14} strokeWidth={1.8} color="var(--color-ink-faint)" aria-hidden />
              <span className="meta">{categoryLabel(intake.category)}</span>
              <span aria-hidden style={{ color: "var(--color-border-strong)" }}>·</span>
              <span className={`badge ${stakeColor(intake.stake)}`}>{stakeLabel(intake.stake)}</span>
              <span aria-hidden style={{ color: "var(--color-border-strong)" }}>·</span>
              <span className="meta">{formatDate(createdAt)}</span>
            </div>
          </PageHeader>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {/* Situation */}
            <section className="panel panel-pad">
              <span className="eyebrow" style={{ marginBottom: "0.6rem" }}>
                The situation
              </span>
              <p
                className="measure"
                style={{ fontSize: "var(--text-body)", color: "var(--color-ink-soft)", lineHeight: 1.7, marginBottom: "1.25rem" }}
              >
                {intake.description}
              </p>

              <span className="eyebrow" style={{ marginBottom: "0.6rem" }}>
                Options considered
              </span>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                {intake.options.map((opt) => {
                  const isChosen = opt.id === chosenOptionId;
                  const isRec = opt.id === analysis?.recommendedOptionId;
                  return (
                    <div
                      key={opt.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.6rem",
                        padding: "0.6rem 0.8rem",
                        borderRadius: "var(--radius-md)",
                        border: `1px solid ${isChosen ? "var(--color-sage-border)" : "var(--color-border)"}`,
                        background: isChosen ? "var(--color-sage-pale)" : "var(--color-surface-alt)",
                      }}
                    >
                      <span style={{ fontSize: "var(--text-sm)", color: "var(--color-ink)", fontWeight: isChosen ? 600 : 500 }}>
                        {opt.label}
                      </span>
                      {isChosen && (
                        <span className="badge badge-sage" style={{ marginLeft: "auto" }}>
                          Chosen
                        </span>
                      )}
                      {!isChosen && isRec && (
                        <span className="meta" style={{ marginLeft: "auto" }}>
                          Recommended
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Your choice */}
            {chosenOption && (
              <section
                className="panel panel-pad"
                style={{ borderLeft: "2px solid var(--color-sage)" }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: "0.7rem" }}>
                  <Check size={16} color="var(--color-sage)" strokeWidth={2.4} style={{ flexShrink: 0, marginTop: 3 }} />
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--color-ink)", marginBottom: "0.25rem" }}>
                      You chose {chosenOption.label}
                    </p>
                    {chosenReasoning ? (
                      <p style={{ fontSize: "var(--text-sm)", color: "var(--color-ink-muted)", lineHeight: 1.6 }}>
                        {chosenReasoning}
                      </p>
                    ) : (
                      <p className="meta">No reasoning recorded.</p>
                    )}
                  </div>
                </div>
              </section>
            )}

            {/* Record choice */}
            {status === "analyzed" && (
              <section className="panel panel-pad" style={{ borderLeft: "2px solid var(--color-amber)" }}>
                {!choosingOption ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "1rem",
                      flexWrap: "wrap",
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--color-ink)", marginBottom: "0.2rem" }}>
                        Have you decided?
                      </p>
                      <p className="meta">
                        {recommended
                          ? `Clarity recommends ${recommended.label}. Record what you actually chose to track the outcome later.`
                          : "Record what you chose to track the outcome later."}
                      </p>
                    </div>
                    <button onClick={() => setChoosingOption(true)} className="btn btn-primary btn-sm">
                      Record choice
                    </button>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <fieldset style={{ border: 0 }}>
                      <legend className="field-label" style={{ marginBottom: "0.55rem" }}>
                        Which option did you choose?
                      </legend>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                        {intake.options.map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            className="tile"
                            aria-pressed={chosenId === opt.id}
                            onClick={() => setChosenId(opt.id)}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </fieldset>

                    <div>
                      <label htmlFor="choice-reasoning" className="field-label">
                        What tipped the balance? <span className="optional">— optional</span>
                      </label>
                      <textarea
                        id="choice-reasoning"
                        className="input-field"
                        rows={3}
                        placeholder="Worth writing down — it's the part you'll forget."
                        value={reasoning}
                        onChange={(e) => setReasoning(e.target.value)}
                        style={{ resize: "vertical" }}
                      />
                    </div>

                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button
                        onClick={recordChoice}
                        disabled={!chosenId || savingChoice}
                        className="btn btn-primary"
                      >
                        {savingChoice ? (
                          <>
                            <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />
                            Saving…
                          </>
                        ) : (
                          "Confirm choice"
                        )}
                      </button>
                      <button onClick={() => setChoosingOption(false)} className="btn btn-ghost">
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* Analysis */}
            {analysis && (
              <Collapsible
                title="Full analysis"
                subtitle="Verdict, comparison, pre-mortem, and what would change it"
                defaultOpen
              >
                <AnalysisResults analysis={analysis} intake={intake} />
              </Collapsible>
            )}

            {/* Outcome tracking */}
            {(status === "decided" || status === "tracking") && (
              <Collapsible
                title="Outcome tracking"
                subtitle="Check in at 30, 90, and 180 days to compare what you expected with what happened"
                defaultOpen={status === "tracking"}
              >
                <OutcomeTracker decision={decision} onUpdate={(d) => setDecision(d)} />
              </Collapsible>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

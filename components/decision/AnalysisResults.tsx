"use client";

import { useState } from "react";
import type {
  DecisionAnalysis,
  DecisionIntake,
  OptionAnalysis,
  RecommendationType,
  ConfidenceLevel,
} from "@/types";
import { scoreColor, regretBadge, severityBadge } from "@/lib/utils";
import { ArrowRight, Check, ChevronDown, HelpCircle, Minus, SearchX } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  analysis: DecisionAnalysis;
  intake: Partial<DecisionIntake>;
}

/* ── Backward compatibility ────────────────────────────────────────────────
   Analyses saved before recommendationType / confidenceLevel / confidenceReasoning
   / missingInformation / unknownFactors / scoreRationale existed won't carry them.
   Everything below degrades gracefully rather than rendering blanks.        */

function resolveRecommendationType(analysis: DecisionAnalysis): RecommendationType {
  if (analysis.recommendationType) return analysis.recommendationType;
  return analysis.recommendedOptionId ? "option" : "phased";
}

function resolveConfidenceLevel(analysis: DecisionAnalysis): ConfidenceLevel {
  if (analysis.confidenceLevel) return analysis.confidenceLevel;
  if (analysis.confidenceScore >= 70) return "high";
  if (analysis.confidenceScore >= 40) return "medium";
  return "low";
}

const CONFIDENCE_WORD: Record<ConfidenceLevel, string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
};

function Section({
  eyebrow,
  title,
  children,
  delay = 0,
}: {
  eyebrow?: string;
  title: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      style={{ borderTop: "1px solid var(--color-border)", paddingTop: "1.75rem" }}
    >
      <header style={{ marginBottom: "1.1rem" }}>
        {eyebrow && (
          <span className="eyebrow" style={{ marginBottom: "0.35rem" }}>
            {eyebrow}
          </span>
        )}
        <h2 className="section-title">{title}</h2>
      </header>
      {children}
    </motion.section>
  );
}

/* ── Verdict ───────────────────────────────────────────────────────────── */

function Verdict({ analysis, intake }: Props) {
  const recommendationType = resolveRecommendationType(analysis);
  const confidenceLevel = resolveConfidenceLevel(analysis);
  const recommended = intake.options?.find((o) => o.id === analysis.recommendedOptionId);
  const notRecommended = intake.options?.filter((o) => o.id !== analysis.recommendedOptionId) ?? [];

  const headline = recommended
    ? recommended.label
    : recommendationType === "insufficient_evidence"
    ? "Not enough information yet"
    : "A phased approach fits better";

  const kicker = recommended
    ? "Recommended"
    : recommendationType === "insufficient_evidence"
    ? "No clear preference"
    : "Recommended path";

  const whyLabel =
    recommendationType === "insufficient_evidence"
      ? "What Clarity can say from what you've shared"
      : "Why Clarity recommends this";

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        background: "var(--color-ink)",
        borderRadius: "var(--radius-xl)",
        padding: "clamp(1.5rem, 5vw, 2.25rem)",
        color: "#fff",
      }}
    >
      <span
        className="eyebrow"
        style={{ color: "rgba(255,255,255,0.45)", marginBottom: "1rem" }}
      >
        Clarity&apos;s verdict
      </span>

      <p
        style={{
          fontSize: "0.78rem",
          fontWeight: 600,
          color: "rgba(255,255,255,0.5)",
          marginBottom: "0.5rem",
        }}
      >
        {kicker}
      </p>

      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(1.6rem, 4.5vw, 2.4rem)",
          fontWeight: 600,
          letterSpacing: "-0.03em",
          lineHeight: 1.12,
          color: "#fff",
          marginBottom: "1.25rem",
        }}
      >
        {headline}
      </h1>

      {/* Confidence */}
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
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.95rem",
            fontWeight: 600,
            color: "#fff",
          }}
        >
          {analysis.confidenceScore}%
        </span>
        <span style={{ color: "rgba(255,255,255,0.25)" }}>·</span>
        <span style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.72)", fontWeight: 500 }}>
          {CONFIDENCE_WORD[confidenceLevel]}
        </span>
        <div
          aria-hidden
          style={{
            flex: 1,
            minWidth: 60,
            height: 2,
            background: "rgba(255,255,255,0.14)",
            borderRadius: 1,
          }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${analysis.confidenceScore}%` }}
            transition={{ duration: 0.9, delay: 0.3, ease: "easeOut" }}
            style={{ height: "100%", background: "var(--color-amber)", borderRadius: 1 }}
          />
        </div>
      </div>

      {/* Why */}
      <div style={{ marginBottom: analysis.confidenceReasoning ? "1.25rem" : 0 }}>
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
          {whyLabel}
        </p>
        <p
          className="measure"
          style={{ fontSize: "1rem", lineHeight: 1.7, color: "rgba(255,255,255,0.9)" }}
        >
          {analysis.recommendationReasoning}
        </p>
      </div>

      {/* What would change this */}
      {analysis.confidenceReasoning && (
        <div>
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
          <p
            className="measure"
            style={{ fontSize: "0.92rem", lineHeight: 1.7, color: "rgba(255,255,255,0.62)" }}
          >
            {analysis.confidenceReasoning}
          </p>
        </div>
      )}

      {/* Not recommended */}
      {recommended && notRecommended.length > 0 && (
        <p
          style={{
            marginTop: "1.25rem",
            paddingTop: "1rem",
            borderTop: "1px solid rgba(255,255,255,0.12)",
            fontSize: "0.82rem",
            color: "rgba(255,255,255,0.45)",
          }}
        >
          Not recommended: {notRecommended.map((o) => o.label).join(" · ")}
        </p>
      )}

      {/* Summary */}
      <p
        className="measure"
        style={{
          marginTop: "1.25rem",
          paddingTop: "1rem",
          borderTop: "1px solid rgba(255,255,255,0.12)",
          fontSize: "0.88rem",
          lineHeight: 1.7,
          color: "rgba(255,255,255,0.55)",
        }}
      >
        {analysis.summary}
      </p>
    </motion.section>
  );
}

/* ── Option comparison ─────────────────────────────────────────────────── */

function OptionComparison({ analysis }: { analysis: DecisionAnalysis }) {
  const options = analysis.optionAnalyses;
  if (options.length === 0) return null;

  return (
    <Section eyebrow="Side by side" title="Option comparison" delay={0.05}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            options.length <= 2
              ? "repeat(auto-fit, minmax(min(100%, 260px), 1fr))"
              : "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
          gap: "0.75rem",
        }}
      >
        {options.map((opt) => {
          const isRec = opt.optionId === analysis.recommendedOptionId;
          const scored = opt.expectedValue !== null;
          return (
            <div
              key={opt.optionId}
              style={{
                border: isRec ? "1px solid var(--color-ink)" : "1px solid var(--color-border)",
                borderRadius: "var(--radius-lg)",
                background: "var(--color-surface-raised)",
                padding: "1.1rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.6rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", minHeight: 20 }}>
                {isRec && (
                  <span
                    className="badge badge-ink"
                    style={{ fontSize: "0.6rem", padding: "0.15rem 0.5rem" }}
                  >
                    Recommended
                  </span>
                )}
              </div>

              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.05rem",
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                  color: "var(--color-ink)",
                  lineHeight: 1.25,
                }}
              >
                {opt.optionLabel}
              </p>

              <div style={{ display: "flex", alignItems: "baseline", gap: "0.4rem" }}>
                {scored ? (
                  <>
                    <span
                      className={scoreColor(opt.expectedValue)}
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "1.5rem",
                        fontWeight: 600,
                        lineHeight: 1,
                      }}
                    >
                      {opt.expectedValue}
                    </span>
                    <span className="meta">/ 100 expected value</span>
                  </>
                ) : (
                  <span className="meta" style={{ fontStyle: "italic" }}>
                    Insufficient information to score reliably
                  </span>
                )}
              </div>

              {scored && (
                <div
                  aria-hidden
                  style={{
                    height: 3,
                    background: "var(--color-surface-alt)",
                    borderRadius: 2,
                    overflow: "hidden",
                  }}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${opt.expectedValue}%` }}
                    transition={{ duration: 0.8, delay: 0.25, ease: "easeOut" }}
                    style={{
                      height: "100%",
                      background: isRec ? "var(--color-ink)" : "var(--color-border-strong)",
                    }}
                  />
                </div>
              )}

              {opt.scoreRationale && (
                <p style={{ fontSize: "0.8rem", color: "var(--color-ink-muted)", lineHeight: 1.55 }}>
                  {opt.scoreRationale}
                </p>
              )}

              <div
                style={{
                  marginTop: "auto",
                  paddingTop: "0.5rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                }}
              >
                <span className="meta">Regret risk</span>
                <span className={`badge ${regretBadge(opt.regretRisk)}`}>{opt.regretRisk}</span>
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

/* ── Option detail (collapsible) ───────────────────────────────────────── */

function OptionDetail({
  opt,
  isRecommended,
  defaultOpen,
}: {
  opt: OptionAnalysis;
  isRecommended: boolean;
  defaultOpen: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const unknowns = opt.unknownFactors ?? [];

  return (
    <div
      style={{
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-lg)",
        background: "var(--color-surface-raised)",
        overflow: "hidden",
      }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "0.75rem",
          padding: "1rem 1.15rem",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <span style={{ minWidth: 0 }}>
          <span
            style={{
              display: "block",
              fontWeight: 600,
              fontSize: "0.95rem",
              color: "var(--color-ink)",
              marginBottom: "0.15rem",
            }}
          >
            {opt.optionLabel}
            {isRecommended && (
              <span className="meta" style={{ marginLeft: "0.5rem", fontWeight: 500 }}>
                Recommended
              </span>
            )}
          </span>
          <span className="meta">
            {opt.pros.length} pros · {opt.cons.length} cons
            {unknowns.length > 0 && ` · ${unknowns.length} unknown`}
          </span>
        </span>
        <ChevronDown
          size={16}
          color="var(--color-ink-faint)"
          style={{ flexShrink: 0, transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s ease" }}
        />
      </button>

      {open && (
        <div style={{ padding: "0 1.15rem 1.15rem", display: "flex", flexDirection: "column", gap: "1.1rem" }}>
          <div className="analysis-cols" style={{ display: "grid", gap: "1.1rem" }}>
            <div>
              <p className="eyebrow" style={{ color: "var(--color-sage)", marginBottom: "0.5rem" }}>
                Pros
              </p>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                {opt.pros.map((p, i) => (
                  <li key={i} style={{ display: "flex", gap: "0.5rem", fontSize: "0.85rem", color: "var(--color-ink-soft)", lineHeight: 1.55 }}>
                    <Check size={13} color="var(--color-sage)" style={{ flexShrink: 0, marginTop: 3 }} />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="eyebrow" style={{ color: "var(--color-rose)", marginBottom: "0.5rem" }}>
                Cons
              </p>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                {opt.cons.map((c, i) => (
                  <li key={i} style={{ display: "flex", gap: "0.5rem", fontSize: "0.85rem", color: "var(--color-ink-soft)", lineHeight: 1.55 }}>
                    <Minus size={13} color="var(--color-rose)" style={{ flexShrink: 0, marginTop: 3 }} />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {opt.secondOrderEffects.length > 0 && (
            <div>
              <p className="eyebrow" style={{ color: "var(--color-sky)", marginBottom: "0.5rem" }}>
                Second-order effects
              </p>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                {opt.secondOrderEffects.map((e, i) => (
                  <li key={i} style={{ display: "flex", gap: "0.5rem", fontSize: "0.85rem", color: "var(--color-ink-soft)", lineHeight: 1.55 }}>
                    <ArrowRight size={13} color="var(--color-sky)" style={{ flexShrink: 0, marginTop: 3 }} />
                    {e}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Unknowns — deliberately styled apart from facts */}
          {unknowns.length > 0 && (
            <div
              style={{
                border: "1px dashed var(--color-border-strong)",
                borderRadius: "var(--radius-md)",
                padding: "0.85rem 1rem",
                background: "var(--color-surface-alt)",
              }}
            >
              <p className="eyebrow" style={{ marginBottom: "0.5rem" }}>
                Not known from what you provided
              </p>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                {unknowns.map((u, i) => (
                  <li key={i} style={{ display: "flex", gap: "0.5rem", fontSize: "0.82rem", color: "var(--color-ink-muted)", lineHeight: 1.55 }}>
                    <HelpCircle size={13} color="var(--color-ink-faint)" style={{ flexShrink: 0, marginTop: 3 }} />
                    {u}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Page ──────────────────────────────────────────────────────────────── */

export default function AnalysisResults({ analysis, intake }: Props) {
  const missingInformation = analysis.missingInformation ?? [];
  const wrap = analysis.wrapSummary ?? { widen: "", reality: "", attain: "", prepare: "" };
  // Only render WRAP entries that actually have content — a heading with an
  // empty body must never appear.
  const wrapItems = [
    { key: "widen", label: "Widen", letter: "W", text: wrap.widen },
    { key: "reality", label: "Reality-test", letter: "R", text: wrap.reality },
    { key: "attain", label: "Attain distance", letter: "A", text: wrap.attain },
    { key: "prepare", label: "Prepare", letter: "P", text: wrap.prepare },
  ].filter((w) => w.text && w.text.trim().length > 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <Verdict analysis={analysis} intake={intake} />

      {missingInformation.length > 0 && (
        <Section eyebrow="Open questions" title="What would change this analysis" delay={0.04}>
          <p className="measure" style={{ fontSize: "0.88rem", color: "var(--color-ink-muted)", marginBottom: "0.9rem", lineHeight: 1.6 }}>
            This analysis is grounded only in what you provided. These are the gaps that matter most.
          </p>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {missingInformation.map((q, i) => (
              <li
                key={i}
                style={{
                  display: "flex",
                  gap: "0.65rem",
                  fontSize: "0.88rem",
                  color: "var(--color-ink-soft)",
                  lineHeight: 1.6,
                }}
              >
                <SearchX size={14} color="var(--color-ink-faint)" style={{ flexShrink: 0, marginTop: 3 }} />
                {q}
              </li>
            ))}
          </ul>
        </Section>
      )}

      <OptionComparison analysis={analysis} />

      <Section eyebrow="In detail" title="Option analysis" delay={0.06}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          {analysis.optionAnalyses.map((opt) => (
            <OptionDetail
              key={opt.optionId}
              opt={opt}
              isRecommended={opt.optionId === analysis.recommendedOptionId}
              defaultOpen={
                analysis.optionAnalyses.length <= 2 ||
                opt.optionId === analysis.recommendedOptionId
              }
            />
          ))}
        </div>
      </Section>

      {analysis.preMortems.length > 0 && (
        <Section eyebrow="Looking forward" title="Pre-mortem" delay={0.08}>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {analysis.preMortems.map((pm) => (
              <div key={pm.optionId}>
                <p style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--color-ink)", marginBottom: "0.6rem" }}>
                  {pm.optionLabel}
                </p>
                <div className="premortem-grid" style={{ display: "grid", gap: "0.6rem" }}>
                  {[
                    { label: "Best case", text: pm.bestCase, color: "var(--color-sage)" },
                    { label: "Plausible outcome", text: pm.mostLikely, color: "var(--color-ink-muted)" },
                    { label: "Worst case", text: pm.worstCase, color: "var(--color-rose)" },
                  ].map(({ label, text, color }) => (
                    <div
                      key={label}
                      style={{
                        padding: "0.85rem 0.95rem",
                        borderRadius: "var(--radius-md)",
                        background: "var(--color-surface-raised)",
                        border: "1px solid var(--color-border)",
                      }}
                    >
                      <p className="eyebrow" style={{ color, marginBottom: "0.4rem" }}>
                        {label}
                      </p>
                      <p style={{ fontSize: "0.84rem", color: "var(--color-ink-soft)", lineHeight: 1.6 }}>
                        {text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {analysis.biasesDetected.length > 0 && (
        <Section eyebrow="Worth a second look" title="Potential biases to watch for" delay={0.1}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {analysis.biasesDetected.map((bias) => (
              <div
                key={bias.name}
                style={{
                  padding: "1rem 1.15rem",
                  borderRadius: "var(--radius-md)",
                  background: "var(--color-surface-raised)",
                  border: "1px solid var(--color-border)",
                  borderLeft: "2px solid var(--color-amber)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem", flexWrap: "wrap" }}>
                  <span style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--color-ink)" }}>
                    {bias.name}
                  </span>
                  <span className={`badge ${severityBadge(bias.severity)}`}>{bias.severity}</span>
                </div>
                <p style={{ fontSize: "0.85rem", color: "var(--color-ink-muted)", marginBottom: "0.5rem", lineHeight: 1.6 }}>
                  {bias.description}
                </p>
                {bias.evidence && (
                  <p style={{ fontSize: "0.83rem", color: "var(--color-ink-soft)", lineHeight: 1.6, fontStyle: "italic" }}>
                    From your input: &ldquo;{bias.evidence}&rdquo;
                  </p>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {wrapItems.length > 0 && (
        <Section eyebrow="Decision framework" title="WRAP" delay={0.12}>
          <div className="wrap-grid" style={{ display: "grid", gap: "0.75rem" }}>
            {wrapItems.map(({ key, label, letter, text }) => (
              <div
                key={key}
                style={{
                  padding: "1rem 1.15rem",
                  borderRadius: "var(--radius-md)",
                  background: "var(--color-surface-raised)",
                  border: "1px solid var(--color-border)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "0.95rem",
                      fontWeight: 700,
                      color: "var(--color-amber)",
                    }}
                  >
                    {letter}
                  </span>
                  <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--color-ink)" }}>
                    {label}
                  </span>
                </div>
                <p style={{ fontSize: "0.84rem", color: "var(--color-ink-soft)", lineHeight: 1.6 }}>
                  {text}
                </p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {analysis.keyQuestions.length > 0 && (
        <Section eyebrow="Before you commit" title="Questions to ask yourself" delay={0.14}>
          <ol style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.7rem" }}>
            {analysis.keyQuestions.map((q, i) => (
              <li key={i} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                <span className="marker" style={{ marginTop: 2 }}>
                  {i + 1}
                </span>
                <span style={{ fontSize: "0.9rem", color: "var(--color-ink-soft)", lineHeight: 1.65 }}>
                  {q}
                </span>
              </li>
            ))}
          </ol>
        </Section>
      )}

      <ExecutionPlanner category={intake.category ?? "other"} />

      {/* Responsive grids — kept here so the layout rules live with the component */}
      <style>{`
        .analysis-cols { grid-template-columns: 1fr; }
        .premortem-grid { grid-template-columns: 1fr; }
        .wrap-grid { grid-template-columns: 1fr; }
        @media (min-width: 640px) {
          .analysis-cols  { grid-template-columns: 1fr 1fr; }
          .premortem-grid { grid-template-columns: repeat(3, 1fr); }
          .wrap-grid      { grid-template-columns: 1fr 1fr; }
        }
      `}</style>
    </div>
  );
}

/* ── Execution planner ─────────────────────────────────────────────────── */

const PLANNER_TEMPLATES: Record<
  string,
  { rows: { id: string; label: string; placeholder: string; hint: string }[] }
> = {
  career: {
    rows: [
      { id: "runway", label: "Financial runway target", placeholder: "e.g. 6 months of expenses saved", hint: "What you'd want banked before committing" },
      { id: "timesplit", label: "Time split", placeholder: "e.g. 80% current role / 20% side work", hint: "How your hours are allocated now" },
      { id: "validate", label: "Validation goal", placeholder: "e.g. first paying customer", hint: "The proof point that settles it" },
      { id: "trigger", label: "Switch trigger", placeholder: "e.g. two months of consistent growth", hint: "The condition that tells you to commit" },
      { id: "deadline", label: "Re-evaluation date", placeholder: "e.g. review in 6 months", hint: "When you'll honestly reassess" },
    ],
  },
  financial: {
    rows: [
      { id: "capital", label: "Available capital", placeholder: "e.g. amount you can put at risk", hint: "Without touching essentials" },
      { id: "maxloss", label: "Max acceptable loss", placeholder: "e.g. the number you can sleep with", hint: "Your real floor" },
      { id: "timeline", label: "Investment horizon", placeholder: "e.g. 3 years minimum", hint: "How long this can stay locked up" },
      { id: "exitplan", label: "Exit condition", placeholder: "e.g. target return, or stop loss", hint: "Decide before you're emotional" },
    ],
  },
  business: {
    rows: [
      { id: "runway", label: "Cash runway", placeholder: "e.g. months at current burn", hint: "How long you can operate without new revenue" },
      { id: "mvp", label: "MVP target", placeholder: "e.g. working product in 6 weeks", hint: "Smallest thing that proves the idea" },
      { id: "validate", label: "Validation metric", placeholder: "e.g. paying customers at a set price", hint: "What proves real demand" },
      { id: "trigger", label: "Scale trigger", placeholder: "e.g. 3 months of growing revenue", hint: "When testing becomes commitment" },
      { id: "exitplan", label: "Recovery plan", placeholder: "e.g. return to contracting", hint: "If month 3 goes badly" },
    ],
  },
  relocation: {
    rows: [
      { id: "runway", label: "Financial buffer", placeholder: "e.g. months of expenses in the new city", hint: "Before you need income there" },
      { id: "validate", label: "Trial condition", placeholder: "e.g. a 3-month trial before committing", hint: "Can you test before committing?" },
      { id: "trigger", label: "Commit trigger", placeholder: "e.g. offer signed + housing secured", hint: "What must be true before moving" },
      { id: "exitplan", label: "Return plan", placeholder: "e.g. keep the old lease for 2 months", hint: "How you reverse this" },
    ],
  },
  default: {
    rows: [
      { id: "runway", label: "Resources available", placeholder: "e.g. time, money, or support", hint: "What you have to work with" },
      { id: "validate", label: "Validation goal", placeholder: "e.g. the proof point that confirms this", hint: "Evidence you're on the right path" },
      { id: "trigger", label: "Commit trigger", placeholder: "e.g. when X happens, I commit fully", hint: "The condition that escalates commitment" },
      { id: "exitplan", label: "Recovery plan", placeholder: "e.g. if this fails by month 3, I will…", hint: "Decide before you need it" },
      { id: "deadline", label: "Re-evaluation date", placeholder: "e.g. revisit in 3 months", hint: "When you'll reassess honestly" },
    ],
  },
};

function getTemplate(category: string) {
  return PLANNER_TEMPLATES[category] ?? PLANNER_TEMPLATES.default;
}

function ExecutionPlanner({ category }: { category: string }) {
  const template = getTemplate(category);
  const [values, setValues] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);

  const filledCount = template.rows.filter((r) => values[r.id]?.trim()).length;

  function copyPlan() {
    const lines = template.rows
      .filter((r) => values[r.id]?.trim())
      .map((r) => `${r.label}: ${values[r.id]}`);
    navigator.clipboard.writeText(lines.join("\n")).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.16 }}
      style={{ borderTop: "1px solid var(--color-border)", paddingTop: "1.75rem" }}
    >
      <header style={{ marginBottom: "0.75rem" }}>
        <span className="eyebrow" style={{ marginBottom: "0.35rem" }}>
          Final step
        </span>
        <h2 className="section-title">Make it executable</h2>
      </header>

      <p
        className="measure"
        style={{ fontSize: "0.88rem", color: "var(--color-ink-muted)", lineHeight: 1.65, marginBottom: "1.25rem" }}
      >
        Turn the analysis into a concrete plan. Clarity doesn&apos;t know these numbers — you define
        them. They stay in your browser.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
        {template.rows.map((row) => (
          <div key={row.id}>
            <label htmlFor={`exec-${row.id}`} className="field-label">
              {row.label} <span className="optional">— {row.hint}</span>
            </label>
            <input
              id={`exec-${row.id}`}
              className="input-field"
              placeholder={row.placeholder}
              value={values[row.id] ?? ""}
              onChange={(e) => setValues((v) => ({ ...v, [row.id]: e.target.value }))}
            />
          </div>
        ))}
      </div>

      {filledCount > 0 && (
        <div
          style={{
            marginTop: "1.25rem",
            paddingTop: "1rem",
            borderTop: "1px solid var(--color-border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <span className="meta">
            {filledCount} of {template.rows.length} defined
          </span>
          <button onClick={copyPlan} className="btn btn-ghost btn-sm">
            {copied ? <Check size={13} /> : null}
            {copied ? "Copied" : "Copy plan"}
          </button>
        </div>
      )}
    </motion.section>
  );
}

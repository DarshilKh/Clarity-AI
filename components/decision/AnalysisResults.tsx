"use client";

import { useState } from "react";
import type { DecisionAnalysis, DecisionIntake } from "@/types";
import { scoreColor, regretBadge, severityBadge, categoryEmoji } from "@/lib/utils";
import {
  Brain,
  AlertTriangle,
  Target,
  HelpCircle,
  Layers,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  analysis: DecisionAnalysis;
  intake: Partial<DecisionIntake>;
}

function Section({
  icon: Icon,
  title,
  children,
  delay = 0,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      style={{
        background: "var(--color-surface-raised)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-lg)",
        padding: "1.5rem",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "1.1rem" }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "var(--radius-sm)",
            background: "var(--color-surface-alt)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon size={16} color="var(--color-ink-muted)" strokeWidth={2} />
        </div>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.05rem", fontWeight: 700, color: "var(--color-ink)" }}>
          {title}
        </h3>
      </div>
      {children}
    </motion.div>
  );
}

export default function AnalysisResults({ analysis, intake }: Props) {
  const recommended = intake.options?.find((o) => o.id === analysis.recommendedOptionId);
  const notRecommended = intake.options?.filter((o) => o.id !== analysis.recommendedOptionId);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

      {/* ═══════════════════════════════════════════════════
          VERDICT CARD — the hero, the whole point of Clarity
          Shows FIRST, big and unmissable
      ════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ borderRadius: "var(--radius-xl)", overflow: "hidden", border: "1px solid var(--color-border)" }}
      >
        {/* Amber label strip at top */}
        <div
          style={{
            background: "var(--color-amber)",
            padding: "0.5rem 1.5rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <Brain size={14} color="white" strokeWidth={2.5} />
          <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "white", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Clarity&apos;s Verdict
          </span>
        </div>

        {/* Dark body with the actual answer */}
        <div style={{ background: "var(--color-ink)", padding: "1.75rem 1.75rem 1.5rem" }}>
          {recommended ? (
            <>
              {/* THE answer — unmissable */}
              <div style={{ marginBottom: "1.25rem" }}>
                <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.4)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.6rem" }}>
                  You should
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "0.875rem", flexWrap: "wrap" }}>
                  <CheckCircle2 size={30} color="var(--color-amber)" strokeWidth={2} style={{ flexShrink: 0 }} />
                  <h2
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "clamp(1.5rem, 5vw, 2.2rem)",
                      fontWeight: 800,
                      color: "white",
                      letterSpacing: "-0.03em",
                      lineHeight: 1.1,
                    }}
                  >
                    {recommended.label}
                  </h2>
                  <span style={{ fontSize: "1.6rem", flexShrink: 0 }}>
                    {categoryEmoji(intake.category ?? "other")}
                  </span>
                </div>
              </div>

              {/* Why — the reasoning */}
              <div
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "var(--radius-md)",
                  padding: "1rem 1.25rem",
                  marginBottom: "1rem",
                }}
              >
                <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.5rem" }}>
                  Why Clarity recommends this
                </p>
                <p style={{ fontSize: "0.975rem", color: "rgba(255,255,255,0.88)", lineHeight: 1.72, fontStyle: "italic" }}>
                  &ldquo;{analysis.recommendationReasoning}&rdquo;
                </p>
              </div>

              {/* Not recommended strip */}
              {notRecommended && notRecommended.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.625rem",
                    padding: "0.65rem 1rem",
                    background: "rgba(184,58,64,0.14)",
                    border: "1px solid rgba(184,58,64,0.28)",
                    borderRadius: "var(--radius-md)",
                    marginBottom: "1.25rem",
                    flexWrap: "wrap",
                  }}
                >
                  <XCircle size={14} color="var(--color-rose)" strokeWidth={2} style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.45)" }}>Not recommended:</span>
                  <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>
                    {notRecommended.map((o) => o.label).join(" · ")}
                  </span>
                </div>
              )}
            </>
          ) : (
            /* No single option wins — phased/hybrid path is better */
            <div style={{ marginBottom: "1.25rem" }}>
              <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.4)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.6rem" }}>
                Neither option alone is correct
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.1rem" }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: "rgba(200,134,10,0.25)",
                    border: "2px solid var(--color-amber)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <span style={{ fontSize: "1rem" }}>⚡</span>
                </div>
                <h2
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(1.2rem, 4vw, 1.8rem)",
                    fontWeight: 800,
                    color: "white",
                    letterSpacing: "-0.03em",
                    lineHeight: 1.15,
                  }}
                >
                  A phased approach beats both options
                </h2>
              </div>

              {/* Phased plan box */}
              <div
                style={{
                  background: "rgba(200,134,10,0.1)",
                  border: "1px solid rgba(200,134,10,0.3)",
                  borderRadius: "var(--radius-md)",
                  padding: "1rem 1.25rem",
                  marginBottom: "0.75rem",
                }}
              >
                <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.6rem" }}>
                  Clarity&apos;s recommended path
                </p>
                <p style={{ fontSize: "0.95rem", color: "rgba(255,255,255,0.88)", lineHeight: 1.75, fontStyle: "italic" }}>
                  &ldquo;{analysis.recommendationReasoning}&rdquo;
                </p>
              </div>

              {/* All options are partial */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.625rem",
                  padding: "0.6rem 1rem",
                  background: "rgba(184,58,64,0.12)",
                  border: "1px solid rgba(184,58,64,0.25)",
                  borderRadius: "var(--radius-md)",
                  flexWrap: "wrap",
                }}
              >
                <XCircle size={13} color="var(--color-rose)" strokeWidth={2} style={{ flexShrink: 0 }} />
                <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.45)" }}>
                  Binary choice between:
                </span>
                <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.65)", fontWeight: 600 }}>
                  {intake.options?.map((o) => o.label).join(" vs ")}
                </span>
                <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.4)" }}>
                  — is a false dilemma
                </span>
              </div>
            </div>
          )}

          {/* Summary */}
          <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.7, borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "1.1rem" }}>
            {analysis.summary}
          </p>

          {/* Confidence bar */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginTop: "1rem" }}>
            <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.3)", whiteSpace: "nowrap" }}>Confidence</span>
            <div style={{ flex: 1, height: 5, background: "rgba(255,255,255,0.1)", borderRadius: 3 }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${analysis.confidenceScore}%` }}
                transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
                style={{ height: "100%", background: "var(--color-amber)", borderRadius: 3 }}
              />
            </div>
            <span style={{ fontSize: "0.82rem", color: "var(--color-amber)", fontFamily: "var(--font-mono)", fontWeight: 700, minWidth: 36, textAlign: "right" }}>
              {analysis.confidenceScore}%
            </span>
          </div>
        </div>

        {/* Bottom hint strip */}
        <div
          style={{
            background: "var(--color-amber-pale)",
            borderTop: "1px solid var(--color-amber-border)",
            padding: "0.8rem 1.5rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <ArrowRight size={13} color="var(--color-amber)" strokeWidth={2.5} style={{ flexShrink: 0 }} />
          <p style={{ fontSize: "0.8rem", color: "var(--color-amber)", fontWeight: 500 }}>
            Scroll down to review the full analysis, pre-mortem scenarios, and questions to ask yourself before deciding.
          </p>
        </div>
      </motion.div>

      {/* ═══════════════════════════════════════
          EXPECTED VALUE — visual bar comparison
      ════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        style={{
          background: "var(--color-surface-raised)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-lg)",
          padding: "1.25rem 1.5rem",
        }}
      >
        <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--color-ink-faint)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "1rem" }}>
          Expected Value at a Glance
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
          {analysis.optionAnalyses
            .slice()
            .sort((a, b) => b.expectedValue - a.expectedValue)
            .map((opt) => {
              const isRec = opt.optionId === analysis.recommendedOptionId;
              return (
                <div key={opt.optionId}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.35rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                      {isRec ? (
                        <CheckCircle2 size={13} color="var(--color-amber)" strokeWidth={2.5} />
                      ) : (
                        <XCircle size={13} color="var(--color-border-strong)" strokeWidth={2} />
                      )}
                      <span style={{ fontSize: "0.875rem", fontWeight: isRec ? 700 : 500, color: isRec ? "var(--color-ink)" : "var(--color-ink-muted)" }}>
                        {opt.optionLabel}
                      </span>
                      {isRec && (
                        <span className="badge badge-amber" style={{ fontSize: "0.65rem" }}>Recommended</span>
                      )}
                    </div>
                    <span className={scoreColor(opt.expectedValue)} style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: "0.95rem" }}>
                      {opt.expectedValue}/100
                    </span>
                  </div>
                  <div style={{ height: 10, borderRadius: 5, background: "var(--color-surface-alt)", overflow: "hidden" }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${opt.expectedValue}%` }}
                      transition={{ duration: 1.1, delay: 0.3, ease: "easeOut" }}
                      style={{
                        height: "100%",
                        borderRadius: 5,
                        background: isRec ? "var(--color-amber)" : "var(--color-border-strong)",
                      }}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      </motion.div>

      {/* ═══════════════════════
          OPTION-BY-OPTION DETAIL
      ═══════════════════════ */}
      <Section icon={Target} title="Option-by-Option Analysis" delay={0.15}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {analysis.optionAnalyses.map((opt) => {
            const isRec = opt.optionId === analysis.recommendedOptionId;
            return (
              <div
                key={opt.optionId}
                style={{
                  background: "var(--color-surface-alt)",
                  borderRadius: "var(--radius-md)",
                  padding: "1.1rem",
                  border: isRec ? "2px solid var(--color-amber-border)" : "1px solid var(--color-border)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    {isRec && <CheckCircle2 size={15} color="var(--color-amber)" strokeWidth={2.5} />}
                    <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--color-ink)" }}>{opt.optionLabel}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ fontSize: "0.75rem", color: "var(--color-ink-faint)" }}>Expected value</span>
                    <span className={scoreColor(opt.expectedValue)} style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: "1rem" }}>
                      {opt.expectedValue}
                    </span>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "0.75rem" }}>
                  <div>
                    <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--color-sage)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.4rem" }}>✓ Pros</p>
                    <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                      {opt.pros.map((p, i) => (
                        <li key={i} style={{ fontSize: "0.82rem", color: "var(--color-ink-soft)", display: "flex", gap: "0.35rem" }}>
                          <span style={{ color: "var(--color-sage)", flexShrink: 0 }}>+</span>{p}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--color-rose)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.4rem" }}>✗ Cons</p>
                    <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                      {opt.cons.map((c, i) => (
                        <li key={i} style={{ fontSize: "0.82rem", color: "var(--color-ink-soft)", display: "flex", gap: "0.35rem" }}>
                          <span style={{ color: "var(--color-rose)", flexShrink: 0 }}>−</span>{c}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {opt.secondOrderEffects.length > 0 && (
                  <div style={{ marginBottom: "0.6rem" }}>
                    <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--color-sky)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.4rem" }}>↓ Second-order effects</p>
                    <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                      {opt.secondOrderEffects.map((e, i) => (
                        <li key={i} style={{ fontSize: "0.82rem", color: "var(--color-ink-soft)", display: "flex", gap: "0.35rem" }}>
                          <span style={{ color: "var(--color-sky)", flexShrink: 0 }}>→</span>{e}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{ fontSize: "0.72rem", color: "var(--color-ink-faint)" }}>Regret risk:</span>
                  <span className={`badge ${regretBadge(opt.regretRisk)}`}>{opt.regretRisk}</span>
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* ═══════════════
          PRE-MORTEM
      ═══════════════ */}
      <Section icon={Layers} title="Pre-Mortem Analysis" delay={0.2}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {analysis.preMortems.map((pm) => (
            <div key={pm.optionId}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.6rem" }}>
                {pm.optionId === analysis.recommendedOptionId && (
                  <CheckCircle2 size={13} color="var(--color-amber)" strokeWidth={2.5} />
                )}
                <p style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--color-ink)" }}>{pm.optionLabel}</p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem" }}>
                {[
                  { label: "Best case",   text: pm.bestCase,    color: "var(--color-sage)",  Icon: TrendingUp  },
                  { label: "Most likely", text: pm.mostLikely,  color: "var(--color-amber)", Icon: ArrowRight  },
                  { label: "Worst case",  text: pm.worstCase,   color: "var(--color-rose)",  Icon: AlertTriangle },
                ].map(({ label, text, color }) => (
                  <div key={label} style={{ padding: "0.75rem", borderRadius: "var(--radius-md)", background: "var(--color-surface-alt)", borderTop: `3px solid ${color}` }}>
                    <p style={{ fontSize: "0.7rem", fontWeight: 700, color, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.35rem" }}>{label}</p>
                    <p style={{ fontSize: "0.8rem", color: "var(--color-ink-soft)", lineHeight: 1.55 }}>{text}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ══════════════════
          BIASES DETECTED
      ══════════════════ */}
      {analysis.biasesDetected.length > 0 && (
        <Section icon={AlertTriangle} title={`Cognitive Biases Detected (${analysis.biasesDetected.length})`} delay={0.25}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {analysis.biasesDetected.map((bias) => (
              <div
                key={bias.name}
                style={{ padding: "1rem", borderRadius: "var(--radius-md)", background: "var(--color-surface-alt)", borderLeft: "3px solid var(--color-amber)" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem" }}>
                  <span style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--color-ink)" }}>{bias.name}</span>
                  <span className={`badge ${severityBadge(bias.severity)}`}>{bias.severity}</span>
                </div>
                <p style={{ fontSize: "0.82rem", color: "var(--color-ink-muted)", marginBottom: "0.4rem" }}>{bias.description}</p>
                <p style={{ fontSize: "0.82rem", color: "var(--color-ink-soft)", fontStyle: "italic" }}>&ldquo;{bias.evidence}&rdquo;</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ══════════
          WRAP
      ══════════ */}
      <Section icon={Brain} title="WRAP Framework" delay={0.3}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
          {[
            { key: "widen",   label: "W — Widen: Hybrid Path?",       text: analysis.wrapSummary.widen   },
            { key: "reality", label: "R — Reality: Dangerous Assumption", text: analysis.wrapSummary.reality },
            { key: "attain",  label: "A — Attain: Success Milestone",  text: analysis.wrapSummary.attain  },
            { key: "prepare", label: "P — Prepare: Month-3 Fail Plan", text: analysis.wrapSummary.prepare },
          ].map(({ key, label, text }) => (
            <div key={key} style={{ padding: "0.9rem", borderRadius: "var(--radius-md)", background: "var(--color-surface-alt)" }}>
              <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--color-amber)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.4rem" }}>{label}</p>
              <p style={{ fontSize: "0.82rem", color: "var(--color-ink-soft)", lineHeight: 1.6 }}>{text}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ══════════════════════
          KEY QUESTIONS
      ══════════════════════ */}
      <Section icon={HelpCircle} title="Questions to Ask Yourself" delay={0.35}>
        <ul style={{ display: "flex", flexDirection: "column", gap: "0.6rem", listStyle: "none" }}>
          {analysis.keyQuestions.map((q, i) => (
            <li
              key={i}
              style={{ display: "flex", gap: "0.75rem", padding: "0.75rem", borderRadius: "var(--radius-md)", background: "var(--color-surface-alt)" }}
            >
              <span
                style={{
                  flexShrink: 0,
                  width: 22,
                  height: 22,
                  borderRadius: "var(--radius-full)",
                  background: "var(--color-amber-pale)",
                  border: "1px solid var(--color-amber-border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  color: "var(--color-amber)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {i + 1}
              </span>
              <span style={{ fontSize: "0.875rem", color: "var(--color-ink-soft)", lineHeight: 1.6 }}>{q}</span>
            </li>
          ))}
        </ul>
      </Section>

      {/* ══════════════════════════════════════════
          EXECUTION PLANNER — fill in your numbers
          The AI gives direction, you define the specifics
      ════════════════════════════════════════════ */}
      <ExecutionPlanner category={intake.category ?? "other"} />

    </div>
  );
}

// ─── Execution Planner ────────────────────────────────────────────────────────

const PLANNER_TEMPLATES: Record<string, {
  rows: { id: string; label: string; placeholder: string; hint: string }[];
}> = {
  career: {
    rows: [
      { id: "runway",    label: "Financial runway target",     placeholder: "e.g. 6 months savings = ₹3–6 lakh",        hint: "How much saved before you'd feel safe making the leap?" },
      { id: "timesplit", label: "Time split (current vs new)", placeholder: "e.g. 80% job / 20% side project",           hint: "How do you allocate your hours right now?" },
      { id: "validate",  label: "Validation goal",             placeholder: "e.g. 100 real users OR ₹10k revenue",       hint: "What proof point makes the riskier path clearly correct?" },
      { id: "trigger",   label: "Switch trigger",              placeholder: "e.g. consistent growth for 2–3 months",     hint: "The specific condition that tells you it's time to commit fully" },
      { id: "deadline",  label: "Decision deadline",           placeholder: "e.g. Review again in 6 months",             hint: "When do you re-evaluate if you're on the phased path?" },
    ],
  },
  financial: {
    rows: [
      { id: "capital",   label: "Available capital",           placeholder: "e.g. ₹5 lakh investable",                  hint: "How much can you put at risk without affecting essentials?" },
      { id: "maxloss",   label: "Max acceptable loss",         placeholder: "e.g. ₹1 lakh — below this I'm fine",       hint: "The number below which you can sleep at night" },
      { id: "timeline",  label: "Investment horizon",          placeholder: "e.g. 3 years minimum",                     hint: "How long can this money be locked up?" },
      { id: "exitplan",  label: "Exit condition",              placeholder: "e.g. 2x return OR stop loss at -30%",       hint: "Pre-commit to when you take profits or cut losses" },
    ],
  },
  business: {
    rows: [
      { id: "runway",    label: "Cash runway",                 placeholder: "e.g. 8 months at current burn",            hint: "How long can you operate without new revenue?" },
      { id: "mvp",       label: "MVP target",                  placeholder: "e.g. Working product in 6 weeks",          hint: "What's the smallest thing that proves the idea works?" },
      { id: "validate",  label: "Validation metric",           placeholder: "e.g. 50 paying customers at ₹500/mo",      hint: "What number means the market actually wants this?" },
      { id: "trigger",   label: "Scale trigger",               placeholder: "e.g. 3 months of growing revenue",         hint: "When do you go from testing to full commitment?" },
      { id: "exitplan",  label: "Fail recovery plan",          placeholder: "e.g. Return to freelancing within 2 weeks", hint: "If month 3 is a disaster, what exactly do you do?" },
    ],
  },
  relocation: {
    rows: [
      { id: "runway",    label: "Financial buffer",            placeholder: "e.g. 4 months expenses in new city",       hint: "How long can you survive before needing income there?" },
      { id: "validate",  label: "Trial condition",             placeholder: "e.g. 3-month trial before full move",      hint: "Can you test the new location before committing?" },
      { id: "trigger",   label: "Commit trigger",              placeholder: "e.g. Job offer + housing secured",         hint: "What two things need to be true before you move?" },
      { id: "exitplan",  label: "Return plan",                 placeholder: "e.g. Old lease kept for 2 months",         hint: "How do you reverse this if it doesn't work?" },
    ],
  },
  default: {
    rows: [
      { id: "runway",    label: "Resources / runway",          placeholder: "e.g. Time, money, or support available",   hint: "What do you have to work with?" },
      { id: "validate",  label: "Validation goal",             placeholder: "e.g. What proof point makes this right?",  hint: "The evidence that confirms you're on the correct path" },
      { id: "trigger",   label: "Commit trigger",              placeholder: "e.g. When X happens, I fully commit",      hint: "The specific condition that escalates your commitment" },
      { id: "exitplan",  label: "Fail recovery plan",          placeholder: "e.g. If it fails by month 3, I will...",   hint: "Pre-commit to your recovery before you need it" },
      { id: "deadline",  label: "Re-evaluation date",          placeholder: "e.g. Revisit in 3 months",                 hint: "When do you stop and honestly assess if this is working?" },
    ],
  },
};

function getTemplate(category: string) {
  return PLANNER_TEMPLATES[category] ?? PLANNER_TEMPLATES.default;
}

function ExecutionPlanner({ category }: { category: string }) {
  const template = getTemplate(category);
  const [values, setValues] = useState<Record<string, string>>({});
  const [copied, setCopied]  = useState(false);

  function update(id: string, val: string) {
    setValues((v) => ({ ...v, [id]: val }));
  }

  const filledCount = template.rows.filter((r) => values[r.id]?.trim()).length;
  const allFilled   = filledCount === template.rows.length;

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
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      style={{
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        border: "1px solid var(--color-border)",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "var(--color-ink)",
          padding: "1rem 1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "0.75rem",
          flexWrap: "wrap",
        }}
      >
        <div>
          <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.09em", marginBottom: "0.2rem" }}>
            Step 5 — Make It Executable
          </p>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.05rem", fontWeight: 700, color: "white" }}>
            Define Your Exact Numbers
          </h3>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "var(--radius-full)",
              background: allFilled ? "var(--color-sage)" : "rgba(255,255,255,0.08)",
              border: `2px solid ${allFilled ? "var(--color-sage)" : "rgba(255,255,255,0.15)"}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.3s ease",
              fontSize: "0.72rem",
              fontWeight: 700,
              fontFamily: "var(--font-mono)",
              color: allFilled ? "white" : "rgba(255,255,255,0.4)",
            }}
          >
            {filledCount}/{template.rows.length}
          </div>
        </div>
      </div>

      {/* Explainer */}
      <div
        style={{
          background: "var(--color-amber-pale)",
          borderBottom: "1px solid var(--color-amber-border)",
          padding: "0.75rem 1.5rem",
          display: "flex",
          gap: "0.625rem",
          alignItems: "flex-start",
        }}
      >
        <span style={{ fontSize: "0.9rem", flexShrink: 0, marginTop: 1 }}>⚡</span>
        <p style={{ fontSize: "0.82rem", color: "var(--color-amber)", lineHeight: 1.65, fontWeight: 500 }}>
          The AI gives direction — you define the specifics. Fill in your actual numbers so the plan has real teeth. These stay in your browser only.
        </p>
      </div>

      {/* Input rows */}
      <div style={{ background: "var(--color-surface-raised)", padding: "1.25rem 1.5rem", display: "flex", flexDirection: "column", gap: "1.1rem" }}>
        {template.rows.map((row, i) => (
          <div key={row.id}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "0.35rem" }}>
              <label
                htmlFor={`exec-${row.id}`}
                style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--color-ink)", display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 18,
                    height: 18,
                    borderRadius: "var(--radius-full)",
                    background: values[row.id]?.trim() ? "var(--color-sage)" : "var(--color-surface-alt)",
                    border: `1px solid ${values[row.id]?.trim() ? "var(--color-sage-border)" : "var(--color-border)"}`,
                    fontSize: "0.6rem",
                    fontWeight: 700,
                    fontFamily: "var(--font-mono)",
                    color: values[row.id]?.trim() ? "white" : "var(--color-ink-faint)",
                    transition: "all 0.2s ease",
                    flexShrink: 0,
                  }}
                >
                  {values[row.id]?.trim() ? "✓" : i + 1}
                </span>
                {row.label}
              </label>
              <span style={{ fontSize: "0.72rem", color: "var(--color-ink-faint)", fontStyle: "italic" }}>
                {row.hint}
              </span>
            </div>
            <input
              id={`exec-${row.id}`}
              className="input-field"
              placeholder={row.placeholder}
              value={values[row.id] ?? ""}
              onChange={(e) => update(row.id, e.target.value)}
            />
          </div>
        ))}
      </div>

      {/* Preview / copy */}
      {filledCount > 0 && (
        <div
          style={{
            background: "var(--color-surface-alt)",
            borderTop: "1px solid var(--color-border)",
            padding: "1rem 1.5rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
            <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-ink-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Your Execution Plan
            </p>
            <button
              onClick={copyPlan}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.35rem",
                padding: "0.3rem 0.8rem",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--color-border)",
                background: copied ? "var(--color-sage-pale)" : "var(--color-surface-raised)",
                color: copied ? "var(--color-sage)" : "var(--color-ink-muted)",
                fontSize: "0.75rem",
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              {copied ? "✓ Copied" : "Copy"}
            </button>
          </div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.8rem",
              lineHeight: 1.9,
              color: "var(--color-ink-soft)",
              display: "flex",
              flexDirection: "column",
              gap: "0.1rem",
            }}
          >
            {template.rows
              .filter((r) => values[r.id]?.trim())
              .map((r) => (
                <div key={r.id} style={{ display: "flex", gap: "0.5rem" }}>
                  <span style={{ color: "var(--color-amber)", fontWeight: 600, minWidth: 160, flexShrink: 0 }}>
                    {r.label}:
                  </span>
                  <span>{values[r.id]}</span>
                </div>
              ))}
          </div>

          {allFilled && (
            <div
              style={{
                marginTop: "1rem",
                padding: "0.75rem 1rem",
                background: "var(--color-sage-pale)",
                border: "1px solid var(--color-sage-border)",
                borderRadius: "var(--radius-md)",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <span style={{ fontSize: "0.9rem" }}>✅</span>
              <p style={{ fontSize: "0.82rem", color: "var(--color-sage)", fontWeight: 600 }}>
                Your plan is complete. Save to journal to keep this alongside your analysis.
              </p>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}

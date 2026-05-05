"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useWizardStore, useToastStore } from "@/store";
import type { DecisionIntake } from "@/types";
import Navbar from "@/components/layout/Navbar";
import Toasts from "@/components/ui/Toasts";
import StepBasics from "@/components/decision/StepBasics";
import StepOptions from "@/components/decision/StepOptions";
import StepContext from "@/components/decision/StepContext";
import AnalysisResults from "@/components/decision/AnalysisResults";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Loader2,
  Save,
  CheckCircle2,
} from "lucide-react";

const STEPS = [
  { label: "Decision",  short: "1" },
  { label: "Options",   short: "2" },
  { label: "Context",   short: "3" },
  { label: "Analysis",  short: "4" },
];

function StepIndicator({ current }: { current: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
      {STEPS.map((step, idx) => {
        const done   = idx < current;
        const active = idx === current;
        const isLast = idx === STEPS.length - 1;

        return (
          <div key={step.label} style={{ display: "flex", alignItems: "center", flex: isLast ? 0 : 1 }}>
            {/* Circle + label */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.3rem" }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "var(--radius-full)",
                  background: done
                    ? "var(--color-sage)"
                    : active
                    ? "var(--color-ink)"
                    : "var(--color-surface-alt)",
                  border: `2px solid ${
                    done ? "var(--color-sage)" : active ? "var(--color-ink)" : "var(--color-border)"
                  }`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.3s ease",
                  flexShrink: 0,
                }}
              >
                {done ? (
                  <CheckCircle2 size={15} color="white" strokeWidth={2.5} />
                ) : (
                  <span
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      color: active ? "white" : "var(--color-ink-faint)",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {idx + 1}
                  </span>
                )}
              </div>
              <span
                style={{
                  fontSize: "0.65rem",
                  fontWeight: active ? 700 : 500,
                  color: active
                    ? "var(--color-ink)"
                    : done
                    ? "var(--color-sage)"
                    : "var(--color-ink-faint)",
                  whiteSpace: "nowrap",
                }}
                className="hide-mobile"
              >
                {step.label}
              </span>
            </div>

            {/* Connector line */}
            {!isLast && (
              <div
                style={{
                  flex: 1,
                  height: 2,
                  background: done ? "var(--color-sage)" : "var(--color-border)",
                  margin: "0 6px",
                  marginBottom: 18,
                  borderRadius: 1,
                  transition: "background 0.4s ease",
                  minWidth: 20,
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function validateStep(step: number, intake: Partial<DecisionIntake>): string | null {
  if (step === 0) {
    if (!intake.title?.trim()) return "Please enter a title for your decision.";
    if (!intake.description?.trim() || intake.description.trim().length < 20)
      return "Please describe the situation in at least 20 characters.";
  }
  if (step === 1) {
    const opts = intake.options ?? [];
    if (opts.length < 2) return "You need at least 2 options.";
    for (const opt of opts) {
      if (!opt.label.trim()) return "Please give every option a label.";
    }
  }
  return null;
}

export default function NewDecisionPage() {
  const router = useRouter();
  const { step, intake, analysis, isAnalyzing, nextStep, prevStep, setAnalysis, setAnalyzing, reset } =
    useWizardStore();
  const { addToast } = useToastStore();
  const [saving, setSaving] = useState(false);

  const isAnalysisStep  = step === 3;
  const isLastInputStep = step === 2;

  async function handleAnalyze() {
    const err = validateStep(step, intake);
    if (err) { addToast("warning", err); return; }

    setAnalyzing(true);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intake }),
      });

      if (res.status === 429) {
        const data = await res.json() as { message: string };
        addToast("error", data.message ?? "Daily limit reached. Try again tomorrow.");
        return;
      }

      if (!res.ok) {
        const data = await res.json() as { error?: string };
        throw new Error(data.error ?? "Analysis failed");
      }

      const data = await res.json() as { analysis: NonNullable<typeof analysis> };
      setAnalysis(data.analysis);
      nextStep();
      addToast("success", "Analysis complete!");
    } catch (err) {
      addToast("error", err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setAnalyzing(false);
    }
  }

  async function handleSave() {
    if (!analysis) return;
    setSaving(true);
    try {
      const res = await fetch("/api/decisions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intake, analysis }),
      });

      if (res.status === 401) {
        addToast("warning", "Sign in to save decisions to your journal.");
        router.push("/auth/login?next=/decision/new");
        return;
      }

      if (!res.ok) {
        const data = await res.json() as { error?: string };
        throw new Error(data.error ?? "Save failed");
      }

      const { decision } = await res.json() as { decision: { id: string } };
      addToast("success", "Saved to your journal!");
      reset();
      router.push(`/decision/${decision.id}`);
    } catch (err) {
      addToast("error", err instanceof Error ? err.message : "Could not save");
    } finally {
      setSaving(false);
    }
  }

  function handleNext() {
    const err = validateStep(step, intake);
    if (err) { addToast("warning", err); return; }
    if (step === 2) { handleAnalyze(); }
    else { nextStep(); }
  }

  return (
    <>
      <Navbar />
      <Toasts />

      <div style={{ minHeight: "calc(100dvh - 60px)", background: "var(--color-surface)" }}>
        <div className="page-wrap-narrow">

          {/* Header */}
          <div style={{ marginBottom: "1.5rem" }}>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.4rem, 5vw, 1.9rem)",
                fontWeight: 800,
                color: "var(--color-ink)",
                marginBottom: "0.25rem",
                letterSpacing: "-0.03em",
              }}
            >
              {isAnalysisStep ? "Your Analysis is Ready" : "New Decision"}
            </h1>
            <p style={{ fontSize: "0.875rem", color: "var(--color-ink-muted)" }}>
              {["What are you deciding?", "What are your options?", "Give us more context", "Your AI-powered breakdown"][step]}
            </p>
          </div>

          {/* Step indicator */}
          <div style={{ marginBottom: "2rem" }}>
            <StepIndicator current={step} />
          </div>

          {/* Step content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.22 }}
            >
              {step === 0 && <StepBasics />}
              {step === 1 && <StepOptions />}
              {step === 2 && <StepContext />}
              {step === 3 && analysis && (
                <AnalysisResults analysis={analysis} intake={intake} />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "2rem",
              paddingTop: "1.25rem",
              borderTop: "1px solid var(--color-border)",
              gap: "0.75rem",
            }}
          >
            <button
              onClick={prevStep}
              disabled={step === 0}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.375rem",
                padding: "0.65rem 1rem",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--color-border)",
                background: "transparent",
                color: "var(--color-ink-muted)",
                fontSize: "0.875rem",
                fontWeight: 500,
                cursor: step === 0 ? "not-allowed" : "pointer",
                opacity: step === 0 ? 0.35 : 1,
                minHeight: 44,
              }}
            >
              <ChevronLeft size={16} />
              <span className="hide-mobile">Back</span>
            </button>

            {/* Rate limit note on step 2 */}
            {step === 2 && !isAnalyzing && (
              <p style={{ fontSize: "0.72rem", color: "var(--color-ink-faint)", textAlign: "center", flex: 1 }}>
                2 free analyses per day
              </p>
            )}

            {isAnalysisStep ? (
              <button
                onClick={handleSave}
                disabled={saving}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.65rem 1.4rem",
                  background: "var(--color-sage)",
                  color: "white",
                  border: "none",
                  borderRadius: "var(--radius-md)",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  cursor: saving ? "not-allowed" : "pointer",
                  opacity: saving ? 0.7 : 1,
                  minHeight: 44,
                }}
              >
                {saving ? (
                  <><Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} /> Saving…</>
                ) : (
                  <><Save size={15} /> Save to Journal</>
                )}
              </button>
            ) : isLastInputStep ? (
              <button
                onClick={handleNext}
                disabled={isAnalyzing}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.65rem 1.4rem",
                  background: isAnalyzing ? "var(--color-ink-muted)" : "var(--color-amber)",
                  color: "white",
                  border: "none",
                  borderRadius: "var(--radius-md)",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  cursor: isAnalyzing ? "not-allowed" : "pointer",
                  minHeight: 44,
                }}
              >
                {isAnalyzing ? (
                  <><Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} /> Analyzing…</>
                ) : (
                  <><Sparkles size={15} /> Analyze with AI</>
                )}
              </button>
            ) : (
              <button
                onClick={handleNext}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.65rem 1.4rem",
                  background: "var(--color-ink)",
                  color: "white",
                  border: "none",
                  borderRadius: "var(--radius-md)",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  minHeight: 44,
                }}
              >
                Continue
                <ChevronRight size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

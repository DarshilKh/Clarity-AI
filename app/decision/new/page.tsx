"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useWizardStore, useToastStore } from "@/store";
import type { DecisionIntake } from "@/types";
import Navbar from "@/components/layout/Navbar";
import Toasts from "@/components/ui/Toasts";
import StepBasics from "@/components/decision/StepBasics";
import StepOptions from "@/components/decision/StepOptions";
import StepContext from "@/components/decision/StepContext";
import AnalysisResults from "@/components/decision/AnalysisResults";
import AuthWall from "@/components/decision/AuthWall";
import AnalysisLoading from "@/components/decision/AnalysisLoading";
import PageHeader from "@/components/ui/PageHeader";
import { createBrowserSupabaseClient } from "@/lib/supabase-browser";
import { ChevronLeft, ChevronRight, Loader2, Save, Check, AlertCircle } from "lucide-react";

const STEPS = [
  { label: "Decision", hint: "What are you deciding?" },
  { label: "Options", hint: "What are your options?" },
  { label: "Context", hint: "What shapes this decision?" },
  { label: "Analysis", hint: "Your analysis" },
];

const RESUME_PATH = "/decision/new?resume=1";

function StepIndicator({ current, onJump }: { current: number; onJump: (i: number) => void }) {
  return (
    <nav aria-label="Progress" style={{ display: "flex", alignItems: "center", width: "100%" }}>
      {STEPS.map((step, idx) => {
        const done = idx < current;
        const active = idx === current;
        const isLast = idx === STEPS.length - 1;
        const reachable = idx <= current;

        return (
          <div key={step.label} style={{ display: "flex", alignItems: "center", flex: isLast ? 0 : 1 }}>
            <button
              onClick={() => reachable && onJump(idx)}
              disabled={!reachable}
              aria-current={active ? "step" : undefined}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "none",
                border: "none",
                padding: 0,
                cursor: reachable ? "pointer" : "default",
              }}
            >
              <span
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: "var(--radius-full)",
                  background: done || active ? "var(--color-ink)" : "transparent",
                  border: `1px solid ${done || active ? "var(--color-ink)" : "var(--color-border-strong)"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  transition: "all 0.25s ease",
                }}
              >
                {done ? (
                  <Check size={12} color="white" strokeWidth={3} />
                ) : (
                  <span
                    style={{
                      fontSize: "0.66rem",
                      fontWeight: 600,
                      fontFamily: "var(--font-mono)",
                      color: active ? "white" : "var(--color-ink-faint)",
                    }}
                  >
                    {idx + 1}
                  </span>
                )}
              </span>
              <span
                className="hide-mobile"
                style={{
                  fontSize: "0.8rem",
                  fontWeight: active ? 600 : 500,
                  color: active ? "var(--color-ink)" : "var(--color-ink-faint)",
                  whiteSpace: "nowrap",
                }}
              >
                {step.label}
              </span>
            </button>

            {!isLast && (
              <span
                aria-hidden
                style={{
                  flex: 1,
                  height: 1,
                  background: done ? "var(--color-ink)" : "var(--color-border)",
                  margin: "0 0.6rem",
                  minWidth: 16,
                  transition: "background 0.3s ease",
                }}
              />
            )}
          </div>
        );
      })}
    </nav>
  );
}

function validateStep(step: number, intake: Partial<DecisionIntake>): string | null {
  if (step === 0) {
    if (!intake.title?.trim()) return "Add a short title for the decision.";
    if (!intake.description?.trim() || intake.description.trim().length < 20)
      return "Describe the situation in at least 20 characters.";
  }
  if (step === 1) {
    const opts = intake.options ?? [];
    if (opts.length < 2) return "You need at least 2 options.";
    for (const opt of opts) {
      if (!opt.label.trim()) return "Give every option a short label.";
    }
  }
  return null;
}

function NewDecisionWorkflow() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    step, intake, analysis, isAnalyzing, hydrated, pendingAnalyze,
    setStep, nextStep, prevStep, setAnalysis, setAnalyzing, setPendingAnalyze, reset,
  } = useWizardStore();
  const { addToast } = useToastStore();

  const [saving, setSaving] = useState(false);
  const [authWallOpen, setAuthWallOpen] = useState(false);
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [usage, setUsage] = useState<{ remaining: number | null; limit: number | null }>({
    remaining: null,
    limit: null,
  });
  const [limitReached, setLimitReached] = useState(false);
  const resumeAttempted = useRef(false);

  const isAnalysisStep = step === 3;
  const isLastInputStep = step === 2;

  // ── Auth + usage state ────────────────────────────────────────────────────
  useEffect(() => {
    const supabase = createBrowserSupabaseClient();
    supabase.auth.getUser().then(({ data }) => setAuthed(Boolean(data.user)));
  }, []);

  const refreshUsage = useCallback(async () => {
    try {
      const res = await fetch("/api/usage");
      if (!res.ok) return;
      const data = (await res.json()) as { remaining: number | null; limit: number | null };
      setUsage({ remaining: data.remaining, limit: data.limit });
    } catch {
      // Usage display is non-critical.
    }
  }, []);

  useEffect(() => {
    if (authed) refreshUsage();
  }, [authed, refreshUsage]);

  // ── Analysis ──────────────────────────────────────────────────────────────
  const runAnalysis = useCallback(async () => {
    setAnalyzing(true);
    setLimitReached(false);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intake }),
      });

      if (res.status === 401) {
        // Not signed in — hold the decision and raise the wall.
        setPendingAnalyze(true);
        setAuthWallOpen(true);
        return;
      }

      if (res.status === 429) {
        setLimitReached(true);
        setPendingAnalyze(false);
        return;
      }

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { message?: string };
        throw new Error(
          data.message ?? "We couldn't complete this analysis. Your decision has not been lost."
        );
      }

      const data = (await res.json()) as {
        analysis: NonNullable<typeof analysis>;
        usage?: { remaining: number; limit: number };
      };

      setAnalysis(data.analysis);
      setPendingAnalyze(false);
      if (data.usage) setUsage({ remaining: data.usage.remaining, limit: data.usage.limit });
      setStep(3);
    } catch (err) {
      addToast(
        "error",
        err instanceof Error
          ? err.message
          : "We couldn't complete this analysis. Your decision has not been lost."
      );
    } finally {
      setAnalyzing(false);
    }
  }, [intake, addToast, setAnalysis, setAnalyzing, setPendingAnalyze, setStep]);

  // ── Resume a pending analysis after authentication ────────────────────────
  useEffect(() => {
    if (!hydrated || authed !== true || resumeAttempted.current) return;
    const shouldResume = searchParams.get("resume") === "1" || pendingAnalyze;
    if (!shouldResume || analysis) return;

    const err = validateStep(0, intake) ?? validateStep(1, intake);
    if (err) {
      setPendingAnalyze(false);
      return;
    }

    resumeAttempted.current = true;
    setAuthWallOpen(false);
    runAnalysis();
  }, [hydrated, authed, pendingAnalyze, searchParams, intake, analysis, runAnalysis, setPendingAnalyze]);

  async function handleAnalyze() {
    const err = validateStep(0, intake) ?? validateStep(1, intake);
    if (err) {
      addToast("warning", err);
      return;
    }
    await runAnalysis();
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
        addToast("warning", "Sign in to save this decision to your journal.");
        router.push(`/auth/login?next=${encodeURIComponent(RESUME_PATH)}`);
        return;
      }

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? "Could not save this decision.");
      }

      const { decision } = (await res.json()) as { decision: { id: string } };
      addToast("success", "Saved to your journal.");
      reset();
      router.push(`/decision/${decision.id}`);
    } catch (err) {
      addToast("error", err instanceof Error ? err.message : "Could not save this decision.");
    } finally {
      setSaving(false);
    }
  }

  function handleNext() {
    const err = validateStep(step, intake);
    if (err) {
      addToast("warning", err);
      return;
    }
    if (step === 2) handleAnalyze();
    else nextStep();
  }

  const showUsage = authed === true && usage.remaining !== null && !isAnalysisStep;

  return (
    <>
      <Navbar />
      <Toasts />

      <AuthWall
        open={authWallOpen}
        onClose={() => setAuthWallOpen(false)}
        returnTo={RESUME_PATH}
        decisionTitle={intake.title?.trim() || undefined}
      />

      <main className="app-body">
        <div className="app-container-narrow">
          <PageHeader
            eyebrow={isAnalysisStep ? "Analysis" : "New decision"}
            title={isAnalysisStep ? "Your analysis" : STEPS[step].hint}
            description={
              isAnalysisStep
                ? "The recommendation, what it rests on, and what would change it."
                : "Clarity separates what you know from what you're assuming, then maps the trade-offs."
            }
          >
            {!isAnalysisStep && <StepIndicator current={step} onJump={setStep} />}
          </PageHeader>

          {/* Step content */}
          <div className={isAnalysisStep ? undefined : "panel panel-pad"}>
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                {step === 0 && <StepBasics />}
                {step === 1 && <StepOptions />}
                {step === 2 && <StepContext />}
                {step === 3 && analysis && <AnalysisResults analysis={analysis} intake={intake} />}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Daily limit reached */}
          {limitReached && !isAnalysisStep && (
            <div
              role="status"
              style={{
                marginTop: "1.5rem",
                border: "1px solid var(--color-amber-border)",
                background: "var(--color-amber-pale)",
                borderRadius: "var(--radius-lg)",
                padding: "1.1rem 1.25rem",
                display: "flex",
                gap: "0.75rem",
                alignItems: "flex-start",
              }}
            >
              <AlertCircle size={17} color="var(--color-amber)" style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <p style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--color-ink)", marginBottom: "0.25rem" }}>
                  You&apos;ve used your free analyses for today.
                </p>
                <p style={{ fontSize: "0.85rem", color: "var(--color-ink-muted)", lineHeight: 1.6 }}>
                  Your decision is saved here. Come back tomorrow to run it, or open your journal to
                  revisit earlier analyses.
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "2rem",
              paddingTop: "1.25rem",
              borderTop: "1px solid var(--color-border)",
              gap: "0.75rem",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={prevStep}
              disabled={step === 0}
              className="btn btn-ghost"
              style={{ opacity: step === 0 ? 0.4 : 1 }}
            >
              <ChevronLeft size={16} />
              <span className="hide-mobile">Back</span>
            </button>

            {showUsage && (
              <p className="meta" style={{ flex: 1, textAlign: "center", minWidth: 120 }}>
                {usage.remaining === 0
                  ? "No analyses remaining today"
                  : `${usage.remaining} ${usage.remaining === 1 ? "analysis" : "analyses"} remaining today`}
              </p>
            )}

            {isAnalysisStep ? (
              <button onClick={handleSave} disabled={saving} className="btn btn-primary">
                {saving ? (
                  <>
                    <Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} /> Saving…
                  </>
                ) : (
                  <>
                    <Save size={15} /> Save to journal
                  </>
                )}
              </button>
            ) : isLastInputStep ? (
              <button onClick={handleNext} disabled={isAnalyzing} className="btn btn-primary">
                {isAnalyzing ? (
                  <>
                    <Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} /> Analyzing…
                  </>
                ) : (
                  "Analyze decision"
                )}
              </button>
            ) : (
              <button onClick={handleNext} className="btn btn-primary">
                Continue
                <ChevronRight size={16} />
              </button>
            )}
          </div>

          {!isAnalysisStep && authed === false && (
            <p className="meta" style={{ textAlign: "center", marginTop: "1rem" }}>
              No account required to start — you&apos;ll be asked to create one when you run the analysis.
            </p>
          )}
        </div>
      </main>

      {isAnalyzing && <AnalysisLoading />}
    </>
  );
}

export default function NewDecisionPage() {
  return (
    <Suspense
      fallback={
        <>
          <Navbar />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "calc(100dvh - var(--header-height))",
              color: "var(--color-ink-faint)",
            }}
          >
            <Loader2 size={20} style={{ animation: "spin 1s linear infinite" }} />
          </div>
        </>
      }
    >
      <NewDecisionWorkflow />
    </Suspense>
  );
}

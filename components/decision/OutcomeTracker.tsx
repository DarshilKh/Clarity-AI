"use client";

import { useState } from "react";
import type { Decision, OutcomeCheckIn } from "@/types";
import { useToastStore } from "@/store";
import { Loader2, Check } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Props {
  decision: Decision;
  onUpdate: (d: Decision) => void;
}

const CHECK_IN_DAYS = [30, 90, 180] as const;

export default function OutcomeTracker({ decision, onUpdate }: Props) {
  const { addToast } = useToastStore();
  const [activeCheckIn, setActiveCheckIn] = useState<30 | 90 | 180 | null>(null);
  const [formData, setFormData] = useState({
    satisfactionScore: 7,
    actualOutcome: "",
    lessonLearned: "",
    wouldChooseAgain: true,
  });
  const [saving, setSaving] = useState(false);

  const existingCheckIns = decision.outcomes ?? [];
  const completedDays = existingCheckIns.map((c) => c.daysAfter);

  async function submitCheckIn() {
    if (!activeCheckIn || !formData.actualOutcome.trim()) {
      addToast("warning", "Describe what actually happened before saving.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decisionId: decision.id, daysAfter: activeCheckIn, ...formData }),
      });
      if (!res.ok) throw new Error("Failed to save");
      const { checkIn } = (await res.json()) as { checkIn: OutcomeCheckIn };
      onUpdate({ ...decision, status: "tracking", outcomes: [...existingCheckIns, checkIn] });
      setActiveCheckIn(null);
      setFormData({ satisfactionScore: 7, actualOutcome: "", lessonLearned: "", wouldChooseAgain: true });
      addToast("success", `${activeCheckIn}-day check-in saved.`);
    } catch {
      addToast("error", "Could not save your check-in. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <p className="measure" style={{ fontSize: "var(--text-sm)", color: "var(--color-ink-muted)", lineHeight: 1.65 }}>
        Compare what you expected with what actually happened. Over time this is what turns individual
        decisions into better judgement.
      </p>

      {/* Check-in selector */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem" }}>
        {CHECK_IN_DAYS.map((days) => {
          const done = completedDays.includes(days);
          const existing = existingCheckIns.find((c) => c.daysAfter === days);
          const active = activeCheckIn === days;
          return (
            <button
              key={days}
              onClick={() => !done && setActiveCheckIn(active ? null : days)}
              disabled={done}
              aria-pressed={active}
              style={{
                padding: "0.9rem 0.7rem",
                borderRadius: "var(--radius-md)",
                border: `1px solid ${
                  done ? "var(--color-sage-border)" : active ? "var(--color-ink)" : "var(--color-border)"
                }`,
                background: done
                  ? "var(--color-sage-pale)"
                  : active
                  ? "var(--color-surface-alt)"
                  : "var(--color-surface-raised)",
                cursor: done ? "default" : "pointer",
                textAlign: "center",
                transition: "border-color 0.15s ease, background-color 0.15s ease",
              }}
            >
              <span
                style={{
                  display: "block",
                  fontFamily: "var(--font-display)",
                  fontSize: "1.3rem",
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                  color: done ? "var(--color-sage)" : "var(--color-ink)",
                  lineHeight: 1,
                  marginBottom: "0.25rem",
                }}
              >
                {days}
              </span>
              <span className="meta" style={{ display: "block" }}>
                days
              </span>
              <span
                className="meta"
                style={{
                  display: "block",
                  marginTop: "0.35rem",
                  color: done ? "var(--color-sage)" : "var(--color-ink-faint)",
                  fontWeight: done ? 600 : 400,
                }}
              >
                {done && existing ? formatDate(existing.createdAt) : "Not recorded"}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active form */}
      {activeCheckIn && (
        <div
          style={{
            border: "1px solid var(--color-border)",
            borderLeft: "2px solid var(--color-ink)",
            borderRadius: "var(--radius-md)",
            padding: "1.15rem",
            display: "flex",
            flexDirection: "column",
            gap: "1.15rem",
            background: "var(--color-surface-raised)",
          }}
        >
          <p style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--color-ink)" }}>
            {activeCheckIn}-day check-in
          </p>

          <div>
            <label htmlFor="satisfaction" className="field-label">
              How satisfied are you with this decision?{" "}
              <span style={{ fontFamily: "var(--font-mono)", fontWeight: 600 }}>
                {formData.satisfactionScore}/10
              </span>
            </label>
            <input
              id="satisfaction"
              type="range"
              min={1}
              max={10}
              value={formData.satisfactionScore}
              onChange={(e) => setFormData((f) => ({ ...f, satisfactionScore: Number(e.target.value) }))}
              style={{ width: "100%", accentColor: "var(--color-ink)" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span className="meta">Regret it</span>
              <span className="meta">Very glad</span>
            </div>
          </div>

          <div>
            <label htmlFor="actual-outcome" className="field-label">
              What actually happened?
            </label>
            <textarea
              id="actual-outcome"
              className="input-field"
              rows={3}
              placeholder="How it played out, compared with what you expected."
              value={formData.actualOutcome}
              onChange={(e) => setFormData((f) => ({ ...f, actualOutcome: e.target.value }))}
              style={{ resize: "vertical" }}
              required
            />
          </div>

          <div>
            <label htmlFor="lesson" className="field-label">
              What would you tell yourself beforehand? <span className="optional">— optional</span>
            </label>
            <textarea
              id="lesson"
              className="input-field"
              rows={2}
              placeholder="The lesson worth carrying into the next decision."
              value={formData.lessonLearned}
              onChange={(e) => setFormData((f) => ({ ...f, lessonLearned: e.target.value }))}
              style={{ resize: "vertical" }}
            />
          </div>

          <fieldset style={{ border: 0 }}>
            <legend className="field-label" style={{ marginBottom: "0.5rem" }}>
              Would you make the same choice again?
            </legend>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {[true, false].map((val) => (
                <button
                  key={String(val)}
                  type="button"
                  className="tile"
                  aria-pressed={formData.wouldChooseAgain === val}
                  onClick={() => setFormData((f) => ({ ...f, wouldChooseAgain: val }))}
                  style={{ justifyContent: "center" }}
                >
                  {val ? "Yes" : "No"}
                </button>
              ))}
            </div>
          </fieldset>

          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button onClick={submitCheckIn} disabled={saving} className="btn btn-primary">
              {saving ? (
                <>
                  <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />
                  Saving…
                </>
              ) : (
                "Save check-in"
              )}
            </button>
            <button onClick={() => setActiveCheckIn(null)} className="btn btn-ghost">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Recorded check-ins */}
      {existingCheckIns.length > 0 && (
        <div>
          <span className="eyebrow" style={{ marginBottom: "0.75rem" }}>
            Recorded check-ins
          </span>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {existingCheckIns
              .slice()
              .sort((a, b) => a.daysAfter - b.daysAfter)
              .map((ci) => (
                <div
                  key={ci.id}
                  style={{
                    padding: "1rem 1.15rem",
                    background: "var(--color-surface-alt)",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--color-border)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "0.75rem",
                      marginBottom: "0.6rem",
                      flexWrap: "wrap",
                    }}
                  >
                    <span style={{ fontWeight: 600, fontSize: "var(--text-sm)", color: "var(--color-ink)" }}>
                      {ci.daysAfter}-day check-in
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "var(--text-sm)",
                          fontWeight: 600,
                          color: "var(--color-ink)",
                        }}
                      >
                        {ci.satisfactionScore}/10
                      </span>
                      <span
                        className="badge"
                        style={{
                          background: ci.wouldChooseAgain ? "var(--color-sage-pale)" : "var(--color-rose-pale)",
                          color: ci.wouldChooseAgain ? "var(--color-sage)" : "var(--color-rose)",
                          border: `1px solid ${
                            ci.wouldChooseAgain ? "var(--color-sage-border)" : "var(--color-rose-border)"
                          }`,
                        }}
                      >
                        {ci.wouldChooseAgain ? (
                          <>
                            <Check size={10} strokeWidth={3} /> Same again
                          </>
                        ) : (
                          "Would change"
                        )}
                      </span>
                    </span>
                  </div>

                  <div style={{ marginBottom: ci.lessonLearned ? "0.6rem" : 0 }}>
                    <p className="kv-label">What happened</p>
                    <p style={{ fontSize: "var(--text-sm)", color: "var(--color-ink-soft)", lineHeight: 1.6 }}>
                      {ci.actualOutcome}
                    </p>
                  </div>

                  {ci.lessonLearned && (
                    <div>
                      <p className="kv-label">Lesson</p>
                      <p style={{ fontSize: "var(--text-sm)", color: "var(--color-ink-muted)", lineHeight: 1.6 }}>
                        {ci.lessonLearned}
                      </p>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

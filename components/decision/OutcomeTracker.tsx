"use client";

import { useState } from "react";
import type { Decision, OutcomeCheckIn } from "@/types";
import { useToastStore } from "@/store";
import { Loader2, CheckCircle2, Star } from "lucide-react";
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
      addToast("warning", "Please describe the actual outcome.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          decisionId: decision.id,
          daysAfter: activeCheckIn,
          ...formData,
        }),
      });
      if (!res.ok) throw new Error("Failed to save");
      const { checkIn } = (await res.json()) as { checkIn: OutcomeCheckIn };
      onUpdate({
        ...decision,
        status: "tracking",
        outcomes: [...existingCheckIns, checkIn],
      });
      setActiveCheckIn(null);
      setFormData({ satisfactionScore: 7, actualOutcome: "", lessonLearned: "", wouldChooseAgain: true });
      addToast("success", `${activeCheckIn}-day check-in saved!`);
    } catch {
      addToast("error", "Could not save check-in");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <p style={{ fontSize: "0.875rem", color: "var(--color-ink-muted)", lineHeight: 1.65 }}>
        Track how this decision actually played out. Compare your predictions against reality to improve your future decision-making.
      </p>

      {/* Check-in buttons */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem" }}>
        {CHECK_IN_DAYS.map((days) => {
          const done = completedDays.includes(days);
          const existing = existingCheckIns.find((c) => c.daysAfter === days);
          return (
            <button
              key={days}
              onClick={() => !done && setActiveCheckIn(activeCheckIn === days ? null : days)}
              disabled={done}
              style={{
                padding: "1rem",
                borderRadius: "var(--radius-md)",
                border: done
                  ? "2px solid var(--color-sage-border)"
                  : activeCheckIn === days
                  ? "2px solid var(--color-amber)"
                  : "1px solid var(--color-border)",
                background: done
                  ? "var(--color-sage-pale)"
                  : activeCheckIn === days
                  ? "var(--color-amber-pale)"
                  : "var(--color-surface-raised)",
                cursor: done ? "default" : "pointer",
                textAlign: "center",
                transition: "all 0.15s ease",
              }}
            >
              <div style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: done ? "var(--color-sage)" : "var(--color-ink-faint)", marginBottom: "0.3rem" }}>
                {done ? "Completed" : "Check-in"}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "1.3rem",
                  fontWeight: 800,
                  color: done ? "var(--color-sage)" : activeCheckIn === days ? "var(--color-amber)" : "var(--color-ink)",
                }}
              >
                {days}
              </div>
              <div style={{ fontSize: "0.72rem", color: "var(--color-ink-faint)", marginTop: "0.2rem" }}>days</div>
              {done && existing && (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "0.2rem", marginTop: "0.4rem" }}>
                  <CheckCircle2 size={12} color="var(--color-sage)" />
                  <span style={{ fontSize: "0.7rem", color: "var(--color-sage)" }}>
                    {formatDate(existing.createdAt)}
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Past check-ins */}
      {existingCheckIns.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <h4 style={{ fontFamily: "var(--font-display)", fontSize: "0.95rem", fontWeight: 700, color: "var(--color-ink)" }}>
            Past Check-ins
          </h4>
          {existingCheckIns.map((ci) => (
            <div
              key={ci.id}
              style={{
                padding: "1rem 1.25rem",
                background: "var(--color-surface-alt)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--color-border)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.6rem" }}>
                <span style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--color-ink)" }}>
                  {ci.daysAfter}-Day Check-in
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                  {Array.from({ length: 10 }, (_, i) => (
                    <Star
                      key={i}
                      size={10}
                      fill={i < ci.satisfactionScore ? "var(--color-amber)" : "transparent"}
                      color={i < ci.satisfactionScore ? "var(--color-amber)" : "var(--color-border)"}
                    />
                  ))}
                  <span style={{ fontSize: "0.72rem", color: "var(--color-amber)", fontWeight: 700, marginLeft: "0.25rem" }}>
                    {ci.satisfactionScore}/10
                  </span>
                </div>
              </div>
              <p style={{ fontSize: "0.82rem", color: "var(--color-ink-soft)", lineHeight: 1.55, marginBottom: "0.4rem" }}>
                <strong>Outcome:</strong> {ci.actualOutcome}
              </p>
              {ci.lessonLearned && (
                <p style={{ fontSize: "0.82rem", color: "var(--color-ink-muted)", fontStyle: "italic" }}>
                  <strong>Lesson:</strong> {ci.lessonLearned}
                </p>
              )}
              <p style={{ fontSize: "0.72rem", color: ci.wouldChooseAgain ? "var(--color-sage)" : "var(--color-rose)", fontWeight: 600, marginTop: "0.4rem" }}>
                {ci.wouldChooseAgain ? "✓ Would choose again" : "✗ Wouldn't choose again"}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Active check-in form */}
      {activeCheckIn && (
        <div
          style={{
            background: "var(--color-surface-raised)",
            border: "1px solid var(--color-amber-border)",
            borderRadius: "var(--radius-lg)",
            padding: "1.25rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <h4 style={{ fontFamily: "var(--font-display)", fontSize: "0.95rem", fontWeight: 700, color: "var(--color-ink)" }}>
            {activeCheckIn}-Day Check-in
          </h4>

          {/* Satisfaction score */}
          <div>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--color-ink-muted)", marginBottom: "0.4rem" }}>
              Satisfaction with this decision:{" "}
              <span style={{ color: "var(--color-amber)", fontFamily: "var(--font-mono)", fontWeight: 800 }}>
                {formData.satisfactionScore}/10
              </span>
            </label>
            <input
              type="range"
              min={1}
              max={10}
              value={formData.satisfactionScore}
              onChange={(e) => setFormData((f) => ({ ...f, satisfactionScore: Number(e.target.value) }))}
              style={{ width: "100%", accentColor: "var(--color-amber)" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.68rem", color: "var(--color-ink-faint)" }}>
              <span>Regret it</span>
              <span>Neutral</span>
              <span>Best decision ever</span>
            </div>
          </div>

          {/* Actual outcome */}
          <div>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--color-ink-muted)", marginBottom: "0.35rem" }}>
              What actually happened? *
            </label>
            <textarea
              className="input-field"
              rows={3}
              placeholder="Describe the actual outcome vs. what you predicted..."
              value={formData.actualOutcome}
              onChange={(e) => setFormData((f) => ({ ...f, actualOutcome: e.target.value }))}
            />
          </div>

          {/* Lesson */}
          <div>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--color-ink-muted)", marginBottom: "0.35rem" }}>
              What did you learn?
            </label>
            <textarea
              className="input-field"
              rows={2}
              placeholder="What would you tell yourself before you made this decision?"
              value={formData.lessonLearned}
              onChange={(e) => setFormData((f) => ({ ...f, lessonLearned: e.target.value }))}
            />
          </div>

          {/* Would choose again */}
          <div style={{ display: "flex", gap: "0.75rem" }}>
            {[true, false].map((val) => (
              <button
                key={String(val)}
                onClick={() => setFormData((f) => ({ ...f, wouldChooseAgain: val }))}
                style={{
                  flex: 1,
                  padding: "0.6rem",
                  borderRadius: "var(--radius-md)",
                  border: formData.wouldChooseAgain === val
                    ? `2px solid ${val ? "var(--color-sage)" : "var(--color-rose)"}`
                    : "1px solid var(--color-border)",
                  background: formData.wouldChooseAgain === val
                    ? val ? "var(--color-sage-pale)" : "var(--color-rose-pale)"
                    : "var(--color-surface-alt)",
                  color: formData.wouldChooseAgain === val
                    ? val ? "var(--color-sage)" : "var(--color-rose)"
                    : "var(--color-ink-muted)",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                {val ? "✓ Would choose again" : "✗ Wouldn't choose again"}
              </button>
            ))}
          </div>

          {/* Submit */}
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button
              onClick={submitCheckIn}
              disabled={saving}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.65rem 1.25rem",
                background: "var(--color-amber)",
                color: "white",
                border: "none",
                borderRadius: "var(--radius-md)",
                fontWeight: 600,
                fontSize: "0.875rem",
                cursor: saving ? "not-allowed" : "pointer",
                opacity: saving ? 0.7 : 1,
              }}
            >
              {saving ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : <CheckCircle2 size={14} />}
              Save Check-in
            </button>
            <button
              onClick={() => setActiveCheckIn(null)}
              style={{
                padding: "0.65rem 1rem",
                background: "transparent",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-md)",
                fontSize: "0.875rem",
                color: "var(--color-ink-muted)",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

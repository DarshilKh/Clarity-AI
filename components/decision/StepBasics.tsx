"use client";

import { useWizardStore } from "@/store";
import type { DecisionCategory, DecisionStake } from "@/types";

const CATEGORIES: { value: DecisionCategory; label: string; emoji: string }[] = [
  { value: "career",       label: "Career",       emoji: "💼" },
  { value: "financial",    label: "Financial",    emoji: "💰" },
  { value: "relationship", label: "Relationship", emoji: "❤️" },
  { value: "health",       label: "Health",       emoji: "🏥" },
  { value: "education",    label: "Education",    emoji: "🎓" },
  { value: "relocation",   label: "Relocation",   emoji: "🏠" },
  { value: "business",     label: "Business",     emoji: "📊" },
  { value: "other",        label: "Other",        emoji: "🔮" },
];

const STAKES: { value: DecisionStake; label: string; desc: string; color: string }[] = [
  { value: "low",      label: "Low",      desc: "Minor, easily reversible",    color: "var(--color-sage)"  },
  { value: "medium",   label: "Medium",   desc: "Moderate, somewhat reversible",color: "var(--color-amber)" },
  { value: "high",     label: "High",     desc: "Major impact, hard to reverse",color: "var(--color-rose)"  },
  { value: "critical", label: "Critical", desc: "Life-changing, permanent",     color: "var(--color-rose)"  },
];

// Convert days to a human-readable label
function timelineLabel(days: number): string {
  if (days === 1) return "1 day";
  if (days < 7) return `${days} days`;
  if (days === 7) return "1 week";
  if (days < 14) return `${days} days`;
  if (days === 14) return "2 weeks";
  if (days < 30) return `${Math.round(days / 7)} weeks`;
  if (days === 30) return "1 month";
  if (days < 60) return `${days} days`;
  if (days === 60) return "2 months";
  if (days < 90) return `${Math.round(days / 30)} months`;
  if (days === 90) return "3 months";
  if (days < 180) return `${Math.round(days / 30)} months`;
  if (days === 180) return "6 months";
  if (days < 365) return `${Math.round(days / 30)} months`;
  if (days === 365) return "1 year";
  return `${Math.round(days / 365 * 10) / 10} years`;
}

// Snap days to meaningful values along the slider
function snapToMeaningful(raw: number): number {
  const steps = [1,2,3,5,7,10,14,21,30,45,60,90,120,180,270,365];
  return steps.reduce((prev, curr) =>
    Math.abs(curr - raw) < Math.abs(prev - raw) ? curr : prev
  );
}

export default function StepBasics() {
  const { intake, updateIntake } = useWizardStore();
  const timelineDays = (intake as { timelineDays?: number }).timelineDays ?? 30;

  function handleSlider(raw: number) {
    const snapped = snapToMeaningful(raw);
    updateIntake({ timelineDays: snapped } as never);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Title */}
      <div>
        <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.5rem", color: "var(--color-ink)" }}>
          What decision are you facing? *
        </label>
        <input
          className="input-field"
          placeholder='e.g. "Should I accept the job offer in Berlin?"'
          value={intake.title ?? ""}
          onChange={(e) => updateIntake({ title: e.target.value })}
          maxLength={120}
        />
      </div>

      {/* Description */}
      <div>
        <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.5rem", color: "var(--color-ink)" }}>
          Describe the situation *
        </label>
        <textarea
          className="input-field"
          placeholder="What's going on? What makes this hard? What do you already know?"
          rows={4}
          value={intake.description ?? ""}
          onChange={(e) => updateIntake({ description: e.target.value })}
          maxLength={1200}
          style={{ resize: "vertical" }}
        />
        <p style={{ fontSize: "0.72rem", color: "var(--color-ink-faint)", marginTop: "0.3rem" }}>
          {(intake.description ?? "").length}/1200 — more context = sharper analysis
        </p>
      </div>

      {/* Category — responsive grid */}
      <div>
        <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.75rem", color: "var(--color-ink)" }}>
          Category
        </label>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
            gap: "0.5rem",
          }}
        >
          {CATEGORIES.map((cat) => {
            const active = intake.category === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => updateIntake({ category: cat.value })}
                style={{
                  padding: "0.6rem 0.4rem",
                  borderRadius: "var(--radius-md)",
                  border: active ? "2px solid var(--color-amber)" : "1px solid var(--color-border)",
                  background: active ? "var(--color-amber-pale)" : "var(--color-surface-raised)",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.25rem",
                }}
              >
                <span style={{ fontSize: "1.1rem" }}>{cat.emoji}</span>
                <span style={{ fontSize: "0.7rem", fontWeight: 600, color: active ? "var(--color-amber)" : "var(--color-ink-muted)" }}>
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Stakes — responsive 2-col on mobile, 4-col on desktop */}
      <div>
        <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.75rem", color: "var(--color-ink)" }}>
          How high are the stakes?
        </label>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
            gap: "0.5rem",
          }}
        >
          {STAKES.map((s) => {
            const active = intake.stake === s.value;
            return (
              <button
                key={s.value}
                onClick={() => updateIntake({ stake: s.value })}
                style={{
                  padding: "0.75rem 0.875rem",
                  borderRadius: "var(--radius-md)",
                  border: active ? `2px solid ${s.color}` : "1px solid var(--color-border)",
                  background: active ? "var(--color-surface-alt)" : "var(--color-surface-raised)",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  textAlign: "left",
                }}
              >
                <div style={{ fontWeight: 600, fontSize: "0.875rem", color: active ? s.color : "var(--color-ink)", marginBottom: "0.2rem" }}>
                  {s.label}
                </div>
                <div style={{ fontSize: "0.72rem", color: "var(--color-ink-muted)", lineHeight: 1.4 }}>{s.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Timeline — days with smart labels */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.6rem" }}>
          <label style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--color-ink)" }}>
            How long until you must decide?
          </label>
          <span
            style={{
              background: "var(--color-amber-pale)",
              border: "1px solid var(--color-amber-border)",
              borderRadius: "var(--radius-full)",
              padding: "0.2rem 0.75rem",
              fontSize: "0.82rem",
              fontWeight: 700,
              color: "var(--color-amber)",
              fontFamily: "var(--font-mono)",
              whiteSpace: "nowrap",
            }}
          >
            {timelineLabel(timelineDays)}
          </span>
        </div>

        <input
          type="range"
          min={1}
          max={365}
          value={timelineDays}
          onChange={(e) => handleSlider(Number(e.target.value))}
          style={{ width: "100%", accentColor: "var(--color-amber)" }}
        />

        {/* Tick labels */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "0.68rem",
            color: "var(--color-ink-faint)",
            marginTop: "0.3rem",
            padding: "0 2px",
          }}
        >
          <span>1 day</span>
          <span>1 week</span>
          <span>1 month</span>
          <span>3 months</span>
          <span>6 months</span>
          <span>1 year</span>
        </div>

        {/* Quick pick chips */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginTop: "0.75rem" }}>
          {[
            { label: "Today",    days: 1   },
            { label: "3 days",   days: 3   },
            { label: "1 week",   days: 7   },
            { label: "2 weeks",  days: 14  },
            { label: "1 month",  days: 30  },
            { label: "3 months", days: 90  },
            { label: "6 months", days: 180 },
          ].map(({ label, days }) => (
            <button
              key={label}
              onClick={() => updateIntake({ timelineDays: days } as never)}
              style={{
                padding: "0.25rem 0.7rem",
                borderRadius: "var(--radius-full)",
                border: timelineDays === days ? "1px solid var(--color-amber)" : "1px solid var(--color-border)",
                background: timelineDays === days ? "var(--color-amber-pale)" : "var(--color-surface-raised)",
                color: timelineDays === days ? "var(--color-amber)" : "var(--color-ink-muted)",
                fontSize: "0.75rem",
                fontWeight: timelineDays === days ? 600 : 400,
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

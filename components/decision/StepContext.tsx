"use client";

import { useWizardStore } from "@/store";
import { CATEGORIES, categoryIcon } from "@/lib/categories";
import type { DecisionStake } from "@/types";

const STAKES: { value: DecisionStake; label: string; desc: string }[] = [
  { value: "low", label: "Low", desc: "Minor, easily reversible" },
  { value: "medium", label: "Medium", desc: "Moderate, somewhat reversible" },
  { value: "high", label: "High", desc: "Major impact, hard to reverse" },
  { value: "critical", label: "Critical", desc: "Life-changing, permanent" },
];

const DEADLINES = [
  { label: "Today", days: 1 },
  { label: "3 days", days: 3 },
  { label: "1 week", days: 7 },
  { label: "2 weeks", days: 14 },
  { label: "1 month", days: 30 },
  { label: "3 months", days: 90 },
  { label: "6 months", days: 180 },
];

function timelineLabel(days: number): string {
  if (days === 1) return "1 day";
  if (days < 7) return `${days} days`;
  if (days === 7) return "1 week";
  if (days < 30) return `${Math.round(days / 7)} weeks`;
  if (days === 30) return "1 month";
  if (days < 365) return `${Math.round(days / 30)} months`;
  if (days === 365) return "1 year";
  return `${Math.round((days / 365) * 10) / 10} years`;
}

export default function StepContext() {
  const { intake, updateIntake } = useWizardStore();
  const timelineDays = intake.timelineDays ?? 30;
  const context = intake.context ?? "";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Category */}
      <fieldset style={{ border: 0 }}>
        <legend className="field-label" style={{ marginBottom: "0.6rem" }}>
          Category
        </legend>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
            gap: "0.5rem",
          }}
        >
          {CATEGORIES.map((cat) => {
            const Icon = categoryIcon(cat.value);
            const active = intake.category === cat.value;
            return (
              <button
                key={cat.value}
                type="button"
                className="tile"
                aria-pressed={active}
                onClick={() => updateIntake({ category: cat.value })}
              >
                <Icon size={15} strokeWidth={1.75} style={{ flexShrink: 0 }} />
                {cat.label}
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* Stakes */}
      <fieldset style={{ border: 0 }}>
        <legend className="field-label" style={{ marginBottom: "0.6rem" }}>
          How high are the stakes?
        </legend>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: "0.5rem",
          }}
        >
          {STAKES.map((s) => {
            const active = intake.stake === s.value;
            return (
              <button
                key={s.value}
                type="button"
                className="tile"
                aria-pressed={active}
                onClick={() => updateIntake({ stake: s.value })}
                style={{ flexDirection: "column", alignItems: "flex-start", gap: "0.15rem" }}
              >
                <span style={{ fontWeight: 600, fontSize: "0.875rem" }}>{s.label}</span>
                <span style={{ fontSize: "0.75rem", color: "var(--color-ink-faint)", fontWeight: 400 }}>
                  {s.desc}
                </span>
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* Deadline */}
      <fieldset style={{ border: 0 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: "0.6rem",
            gap: "1rem",
          }}
        >
          <legend className="field-label" style={{ marginBottom: 0 }}>
            How long until you must decide?
          </legend>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.82rem",
              fontWeight: 600,
              color: "var(--color-ink)",
              whiteSpace: "nowrap",
            }}
          >
            {timelineLabel(timelineDays)}
          </span>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
          {DEADLINES.map(({ label, days }) => (
            <button
              key={label}
              type="button"
              className="chip"
              aria-pressed={timelineDays === days}
              onClick={() => updateIntake({ timelineDays: days })}
            >
              {label}
            </button>
          ))}
        </div>
      </fieldset>

      {/* Thoughts / constraints */}
      <div>
        <label htmlFor="decision-context" className="field-label">
          Thoughts, fears, and constraints <span className="optional">— optional</span>
        </label>
        <p className="field-hint measure" style={{ marginTop: 0, marginBottom: "0.5rem" }}>
          What matters to you, what you&apos;re worried about, and anything constraining the choice.
          Clarity uses this to weigh trade-offs and to flag reasoning worth a second look — it never
          treats it as fact about your options.
        </p>
        <textarea
          id="decision-context"
          className="input-field"
          placeholder="What's really going on? What would you regret? What can't change?"
          rows={7}
          value={context}
          onChange={(e) => updateIntake({ context: e.target.value })}
          maxLength={2000}
          style={{ resize: "vertical", lineHeight: 1.65 }}
        />
        <p className="field-hint">{context.length}/2000</p>
      </div>
    </div>
  );
}

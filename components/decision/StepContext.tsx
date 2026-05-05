"use client";

import { useWizardStore } from "@/store";

const PROMPTS = [
  "What's the worst thing that could happen if you choose wrong?",
  "What would you regret more — acting or not acting?",
  "Who else is affected by this decision?",
  "What would you tell a friend in this situation?",
  "What are you afraid to admit about this decision?",
];

export default function StepContext() {
  const { intake, updateIntake } = useWizardStore();

  function appendPrompt(prompt: string) {
    const current = intake.context ?? "";
    const separator = current.trim() ? "\n\n" : "";
    updateIntake({ context: current + separator + prompt + " " });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div
        style={{
          background: "var(--color-amber-pale)",
          border: "1px solid var(--color-amber-border)",
          borderRadius: "var(--radius-md)",
          padding: "1rem 1.25rem",
        }}
      >
        <p style={{ fontSize: "0.875rem", color: "var(--color-ink-soft)", lineHeight: 1.65 }}>
          <strong style={{ color: "var(--color-amber)" }}>This is where the magic happens.</strong>{" "}
          Share your fears, gut feelings, constraints, and anything that keeps you up at night about this decision.
          The more honest you are here, the better Clarity can detect biases and blind spots.
        </p>
      </div>

      {/* Quick prompts */}
      <div>
        <p style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--color-ink-muted)", marginBottom: "0.6rem" }}>
          Tap a prompt to add it:
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
          {PROMPTS.map((p) => (
            <button
              key={p}
              onClick={() => appendPrompt(p)}
              style={{
                padding: "0.35rem 0.75rem",
                borderRadius: "var(--radius-full)",
                border: "1px solid var(--color-border)",
                background: "var(--color-surface-raised)",
                fontSize: "0.78rem",
                color: "var(--color-ink-muted)",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--color-amber)";
                e.currentTarget.style.color = "var(--color-amber)";
                e.currentTarget.style.background = "var(--color-amber-pale)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--color-border)";
                e.currentTarget.style.color = "var(--color-ink-muted)";
                e.currentTarget.style.background = "var(--color-surface-raised)";
              }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Context textarea */}
      <div>
        <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.5rem", color: "var(--color-ink)" }}>
          Your thoughts, fears, and constraints
        </label>
        <textarea
          className="input-field"
          placeholder="Write freely. What's really going on? What are you afraid of? What do you know that you haven't said yet?"
          rows={8}
          value={intake.context ?? ""}
          onChange={(e) => updateIntake({ context: e.target.value })}
          maxLength={2000}
          style={{ fontFamily: "var(--font-body)", resize: "vertical" }}
        />
        <p style={{ fontSize: "0.75rem", color: "var(--color-ink-faint)", marginTop: "0.35rem" }}>
          {(intake.context ?? "").length}/2000 characters
        </p>
      </div>
    </div>
  );
}

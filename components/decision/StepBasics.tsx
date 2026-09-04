"use client";

import { useWizardStore } from "@/store";

export default function StepBasics() {
  const { intake, updateIntake } = useWizardStore();
  const description = intake.description ?? "";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
      <div>
        <label htmlFor="decision-title" className="field-label">
          What decision are you facing?
        </label>
        <input
          id="decision-title"
          className="input-field"
          placeholder="e.g. Accept the offer in Berlin, or stay"
          value={intake.title ?? ""}
          onChange={(e) => updateIntake({ title: e.target.value })}
          maxLength={120}
          required
        />
        <p className="field-hint">A short title — you&apos;ll add the detail below.</p>
      </div>

      <div>
        <label htmlFor="decision-description" className="field-label">
          What is the situation?
        </label>
        <textarea
          id="decision-description"
          className="input-field"
          placeholder="What's going on, what makes this hard, and what do you already know for certain?"
          rows={6}
          value={description}
          onChange={(e) => updateIntake({ description: e.target.value })}
          maxLength={1200}
          style={{ resize: "vertical", lineHeight: 1.65 }}
          required
        />
        <p className="field-hint">
          Concrete facts sharpen the analysis. Anything you leave out is treated as unknown, not
          assumed. {description.length}/1200
        </p>
      </div>
    </div>
  );
}

"use client";

import { useWizardStore } from "@/store";
import type { DecisionOption } from "@/types";
import { Plus, Trash2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

const MAX_OPTIONS = 5;

export default function StepOptions() {
  const { intake, updateIntake } = useWizardStore();
  const options: DecisionOption[] = intake.options ?? [];

  function addOption() {
    if (options.length >= MAX_OPTIONS) return;
    updateIntake({ options: [...options, { id: uuidv4(), label: "", description: "" }] });
  }

  function removeOption(id: string) {
    if (options.length <= 2) return;
    updateIntake({ options: options.filter((o) => o.id !== id) });
  }

  function updateOption(id: string, field: keyof DecisionOption, value: string) {
    updateIntake({
      options: options.map((o) => (o.id === id ? { ...o, [field]: value } : o)),
    });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <p className="measure" style={{ fontSize: "0.9rem", color: "var(--color-ink-muted)", lineHeight: 1.65 }}>
        The options you&apos;re choosing between. Specific options produce a sharper comparison — up
        to {MAX_OPTIONS}.
      </p>

      {options.map((opt, idx) => (
        <div
          key={opt.id}
          style={{
            background: "var(--color-surface-raised)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-lg)",
            padding: "1.15rem",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "0.9rem",
            }}
          >
            <span className="eyebrow">Option {idx + 1}</span>
            {options.length > 2 && (
              <button
                onClick={() => removeOption(opt.id)}
                aria-label={`Remove option ${idx + 1}`}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--color-ink-faint)",
                  padding: "0.25rem",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Trash2 size={15} />
              </button>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
            <div>
              <label htmlFor={`option-label-${opt.id}`} className="field-label">
                Short label
              </label>
              <input
                id={`option-label-${opt.id}`}
                className="input-field"
                placeholder={idx === 0 ? "e.g. Accept the offer" : "e.g. Stay in my current role"}
                value={opt.label}
                onChange={(e) => updateOption(opt.id, "label", e.target.value)}
                maxLength={60}
                required
              />
            </div>
            <div>
              <label htmlFor={`option-desc-${opt.id}`} className="field-label">
                What does this option actually mean? <span className="optional">— optional</span>
              </label>
              <textarea
                id={`option-desc-${opt.id}`}
                className="input-field"
                placeholder="What choosing this would look like in practice."
                rows={2}
                value={opt.description}
                onChange={(e) => updateOption(opt.id, "description", e.target.value)}
                maxLength={300}
                style={{ resize: "vertical" }}
              />
            </div>
          </div>
        </div>
      ))}

      {options.length < MAX_OPTIONS && (
        <button
          onClick={addOption}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            padding: "0.85rem",
            border: "1px dashed var(--color-border-strong)",
            borderRadius: "var(--radius-lg)",
            background: "transparent",
            color: "var(--color-ink-muted)",
            cursor: "pointer",
            fontSize: "0.875rem",
            fontWeight: 500,
            transition: "border-color 0.15s ease, color 0.15s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--color-ink)";
            e.currentTarget.style.color = "var(--color-ink)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--color-border-strong)";
            e.currentTarget.style.color = "var(--color-ink-muted)";
          }}
        >
          <Plus size={15} />
          Add another option
        </button>
      )}
    </div>
  );
}

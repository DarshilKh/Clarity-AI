"use client";

import { useWizardStore } from "@/store";
import type { DecisionOption } from "@/types";
import { Plus, Trash2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

export default function StepOptions() {
  const { intake, updateIntake } = useWizardStore();
  const options: DecisionOption[] = intake.options ?? [];

  function addOption() {
    if (options.length >= 5) return;
    updateIntake({
      options: [...options, { id: uuidv4(), label: "", description: "" }],
    });
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
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <p style={{ fontSize: "0.9rem", color: "var(--color-ink-muted)", lineHeight: 1.6 }}>
        Define the options you&apos;re choosing between. Be specific — vague options lead to vague analysis. You can add up to 5.
      </p>

      {options.map((opt, idx) => (
        <div
          key={opt.id}
          style={{
            background: "var(--color-surface-raised)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-lg)",
            padding: "1.25rem",
            position: "relative",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "var(--radius-full)",
                  background: "var(--color-ink)",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  fontFamily: "var(--font-mono)",
                }}
              >
                {idx + 1}
              </div>
              <span style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--color-ink)" }}>
                Option {idx + 1}
              </span>
            </div>
            {options.length > 2 && (
              <button
                onClick={() => removeOption(opt.id)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--color-rose)",
                  padding: "0.25rem",
                  borderRadius: "var(--radius-sm)",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Trash2 size={15} />
              </button>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--color-ink-muted)", marginBottom: "0.35rem" }}>
                Short label *
              </label>
              <input
                className="input-field"
                placeholder={idx === 0 ? "e.g. Accept the offer" : "e.g. Stay at current job"}
                value={opt.label}
                onChange={(e) => updateOption(opt.id, "label", e.target.value)}
                maxLength={60}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--color-ink-muted)", marginBottom: "0.35rem" }}>
                What does this option actually mean?
              </label>
              <textarea
                className="input-field"
                placeholder="Describe what choosing this would look like in practice..."
                rows={2}
                value={opt.description}
                onChange={(e) => updateOption(opt.id, "description", e.target.value)}
                maxLength={300}
              />
            </div>
          </div>
        </div>
      ))}

      {options.length < 5 && (
        <button
          onClick={addOption}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            padding: "0.75rem",
            border: "1.5px dashed var(--color-border-strong)",
            borderRadius: "var(--radius-lg)",
            background: "transparent",
            color: "var(--color-ink-muted)",
            cursor: "pointer",
            fontSize: "0.875rem",
            fontWeight: 500,
            transition: "all 0.15s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--color-amber)";
            e.currentTarget.style.color = "var(--color-amber)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--color-border-strong)";
            e.currentTarget.style.color = "var(--color-ink-muted)";
          }}
        >
          <Plus size={16} />
          Add another option
        </button>
      )}
    </div>
  );
}

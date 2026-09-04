"use client";

import { useEffect, useState } from "react";

// Describes what is actually happening rather than "AI is thinking…".
const STAGES = [
  "Structuring your decision",
  "Separating what's known from what's assumed",
  "Comparing the options",
  "Mapping consequences",
  "Checking what could change the answer",
];

export default function AnalysisLoading() {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setStage((s) => (s + 1 < STAGES.length ? s + 1 : s));
    }, 2600);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 180,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
        background: "rgba(245, 242, 237, 0.92)",
        backdropFilter: "blur(2px)",
      }}
    >
      <div style={{ width: "100%", maxWidth: 340, textAlign: "left" }}>
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.15rem",
            fontWeight: 600,
            letterSpacing: "-0.02em",
            color: "var(--color-ink)",
            marginBottom: "1.25rem",
          }}
        >
          Analyzing your decision
        </p>

        <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          {STAGES.map((label, i) => {
            const done = i < stage;
            const active = i === stage;
            return (
              <li
                key={label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  fontSize: "0.87rem",
                  color: active
                    ? "var(--color-ink)"
                    : done
                    ? "var(--color-ink-faint)"
                    : "var(--color-border-strong)",
                  fontWeight: active ? 600 : 400,
                  transition: "color 0.4s ease",
                }}
              >
                <span
                  aria-hidden
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    flexShrink: 0,
                    background: done || active ? "var(--color-ink)" : "var(--color-border-strong)",
                    opacity: active ? 1 : done ? 0.4 : 0.3,
                    transition: "all 0.4s ease",
                  }}
                />
                {label}
              </li>
            );
          })}
        </ul>

        {/* Indeterminate hairline — one quiet motion cue, nothing more. */}
        <div
          aria-hidden
          style={{
            marginTop: "1.5rem",
            height: 2,
            background: "var(--color-border)",
            borderRadius: 1,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: "38%",
              height: "100%",
              background: "var(--color-ink)",
              borderRadius: 1,
              animation: "clarity-sweep 1.7s ease-in-out infinite",
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes clarity-sweep {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(320%); }
        }
      `}</style>
    </div>
  );
}

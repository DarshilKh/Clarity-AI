"use client";

import type { Decision } from "@/types";
import { categoryEmoji, stakeColor, stakeLabel, formatDate, truncate } from "@/lib/utils";
import { ArrowRight, CheckCircle2, Clock, BarChart2 } from "lucide-react";
import Link from "next/link";

interface Props {
  decision: Decision;
}

const statusConfig: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  analyzed: { label: "Awaiting decision",   icon: Clock,         color: "var(--color-amber)" },
  decided:  { label: "Decision recorded",   icon: CheckCircle2,  color: "var(--color-sage)"  },
  tracking: { label: "Tracking outcome",    icon: BarChart2,     color: "var(--color-sky)"   },
  draft:    { label: "Draft",               icon: Clock,         color: "var(--color-ink-faint)" },
};

export default function DecisionCard({ decision }: Props) {
  const { intake, analysis, status, createdAt, id } = decision;
  const cfg = statusConfig[status] ?? statusConfig.draft;
  const StatusIcon = cfg.icon;

  return (
    <Link href={`/decision/${id}`} style={{ textDecoration: "none", display: "block" }}>
      <div
        className="card card-hover"
        style={{ cursor: "pointer", transition: "all 0.2s ease" }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "0.75rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "1.2rem" }}>{categoryEmoji(intake.category)}</span>
            <span className={`badge ${stakeColor(intake.stake)}`}>{stakeLabel(intake.stake)}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
            <StatusIcon size={13} color={cfg.color} strokeWidth={2} />
            <span style={{ fontSize: "0.72rem", color: cfg.color, fontWeight: 600 }}>{cfg.label}</span>
          </div>
        </div>

        {/* Title */}
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.05rem",
            fontWeight: 700,
            color: "var(--color-ink)",
            marginBottom: "0.4rem",
            lineHeight: 1.3,
          }}
        >
          {intake.title}
        </h3>

        <p style={{ fontSize: "0.82rem", color: "var(--color-ink-muted)", marginBottom: "0.9rem", lineHeight: 1.5 }}>
          {truncate(intake.description, 120)}
        </p>

        {/* Options */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginBottom: "1rem" }}>
          {intake.options.map((opt) => (
            <span
              key={opt.id}
              style={{
                padding: "0.2rem 0.6rem",
                borderRadius: "var(--radius-full)",
                background: "var(--color-surface-alt)",
                border: "1px solid var(--color-border)",
                fontSize: "0.75rem",
                color: "var(--color-ink-muted)",
              }}
            >
              {opt.label || "Option"}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: "0.75rem",
            borderTop: "1px solid var(--color-border)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--color-ink-faint)" }}>{formatDate(createdAt)}</span>
            {analysis && (
              <span style={{ fontSize: "0.75rem", color: "var(--color-ink-faint)" }}>
                Confidence:{" "}
                <span style={{ color: "var(--color-amber)", fontFamily: "var(--font-mono)", fontWeight: 600 }}>
                  {analysis.confidenceScore}%
                </span>
              </span>
            )}
          </div>
          <ArrowRight size={15} color="var(--color-border-strong)" />
        </div>
      </div>
    </Link>
  );
}

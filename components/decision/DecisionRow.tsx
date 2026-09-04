"use client";

import Link from "next/link";
import type { Decision } from "@/types";
import { formatDate, categoryLabel } from "@/lib/utils";
import { categoryIcon } from "@/lib/categories";
import { ChevronRight } from "lucide-react";

const STATUS: Record<string, { label: string; color: string }> = {
  analyzed: { label: "Awaiting your call", color: "var(--color-amber)" },
  decided: { label: "Choice recorded", color: "var(--color-sage)" },
  tracking: { label: "Tracking outcome", color: "var(--color-sky)" },
  draft: { label: "Draft", color: "var(--color-ink-faint)" },
};

export default function DecisionRow({ decision }: { decision: Decision }) {
  const { intake, analysis, status, createdAt, id } = decision;
  const CategoryIcon = categoryIcon(intake.category);
  const st = STATUS[status] ?? STATUS.draft;

  const recommended = analysis
    ? intake.options.find((o) => o.id === analysis.recommendedOptionId)
    : null;

  const verdict = analysis
    ? recommended
      ? recommended.label
      : analysis.recommendationType === "insufficient_evidence"
      ? "Not enough information yet"
      : "Phased approach"
    : null;

  return (
    <Link href={`/decision/${id}`} className="row-link">
      <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          {/* Meta line */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "0.4rem",
              flexWrap: "wrap",
            }}
          >
            <CategoryIcon size={13} strokeWidth={1.8} color="var(--color-ink-faint)" aria-hidden />
            <span className="meta">{categoryLabel(intake.category)}</span>
            <span aria-hidden style={{ color: "var(--color-border-strong)" }}>·</span>
            <span className="meta">{formatDate(createdAt)}</span>
            <span aria-hidden style={{ color: "var(--color-border-strong)" }}>·</span>
            <span
              className="meta"
              style={{ color: st.color, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "0.3rem" }}
            >
              <span
                aria-hidden
                style={{ width: 5, height: 5, borderRadius: "50%", background: st.color, display: "inline-block" }}
              />
              {st.label}
            </span>
          </div>

          {/* Title */}
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.02rem",
              fontWeight: 600,
              letterSpacing: "-0.02em",
              color: "var(--color-ink)",
              lineHeight: 1.3,
              marginBottom: "0.3rem",
            }}
          >
            {intake.title}
          </p>

          {/* Verdict + confidence */}
          {analysis ? (
            <p className="meta" style={{ lineHeight: 1.5 }}>
              <span style={{ color: "var(--color-ink-muted)" }}>Clarity&apos;s verdict:</span>{" "}
              <span style={{ color: "var(--color-ink)", fontWeight: 500 }}>{verdict}</span>
              <span aria-hidden style={{ margin: "0 0.4rem", color: "var(--color-border-strong)" }}>·</span>
              {analysis.confidenceScore}% confidence
            </p>
          ) : (
            <p className="meta clamp-2" style={{ lineHeight: 1.5 }}>
              {intake.description}
            </p>
          )}
        </div>

        <ChevronRight
          size={16}
          color="var(--color-border-strong)"
          style={{ flexShrink: 0, marginTop: 2 }}
          aria-hidden
        />
      </div>
    </Link>
  );
}

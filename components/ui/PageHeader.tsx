"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";

interface Props {
  /** Small uppercase label above the title. */
  eyebrow?: string;
  title: string;
  /** One line explaining what this page is for. */
  description?: string;
  /** Primary action rendered on the right (desktop) / below (mobile). */
  action?: React.ReactNode;
  /** Optional back link shown above the title. */
  backHref?: string;
  backLabel?: string;
  /** Extra content rendered under the description (filters, meta, tabs). */
  children?: React.ReactNode;
}

export default function PageHeader({
  eyebrow,
  title,
  description,
  action,
  backHref,
  backLabel = "Back",
  children,
}: Props) {
  return (
    <header style={{ marginBottom: "clamp(1.5rem, 4vw, 2rem)" }}>
      {backHref && (
        <Link
          href={backHref}
          className="link-quiet"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.3rem",
            fontSize: "var(--text-xs)",
            marginBottom: "0.85rem",
          }}
        >
          <ChevronLeft size={14} />
          {backLabel}
        </Link>
      )}

      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <div style={{ minWidth: 0, flex: "1 1 320px" }}>
          {eyebrow && (
            <span className="eyebrow" style={{ marginBottom: "0.5rem" }}>
              {eyebrow}
            </span>
          )}
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-h1)",
              fontWeight: 600,
              letterSpacing: "-0.03em",
              color: "var(--color-ink)",
              lineHeight: 1.15,
              marginBottom: description ? "0.4rem" : 0,
            }}
          >
            {title}
          </h1>
          {description && (
            <p
              className="measure"
              style={{ fontSize: "var(--text-body)", color: "var(--color-ink-muted)", lineHeight: 1.6 }}
            >
              {description}
            </p>
          )}
        </div>

        {action && <div style={{ flexShrink: 0 }}>{action}</div>}
      </div>

      {children && <div style={{ marginTop: "1.25rem" }}>{children}</div>}
    </header>
  );
}

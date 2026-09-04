"use client";

interface Props {
  label: string;
  value: string | number;
  /** Small qualifier under the value, e.g. "across your analyses". */
  sub?: string;
  icon?: React.ElementType;
}

export default function StatTile({ label, value, sub, icon: Icon }: Props) {
  return (
    <div className="panel panel-pad" style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem" }}>
        <span
          style={{
            fontSize: "var(--text-xs)",
            color: "var(--color-ink-muted)",
            fontWeight: 500,
          }}
        >
          {label}
        </span>
        {Icon && <Icon size={15} color="var(--color-ink-faint)" strokeWidth={1.75} aria-hidden />}
      </div>

      <span
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(1.5rem, 4vw, 1.9rem)",
          fontWeight: 600,
          letterSpacing: "-0.03em",
          color: "var(--color-ink)",
          lineHeight: 1,
        }}
      >
        {value}
      </span>

      {sub && <span className="meta">{sub}</span>}
    </div>
  );
}

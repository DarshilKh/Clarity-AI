"use client";

interface Props {
  icon?: React.ElementType;
  title: string;
  description: string;
  action?: React.ReactNode;
  /** Optional short list explaining what happens next. */
  hints?: string[];
}

export default function EmptyState({ icon: Icon, title, description, action, hints }: Props) {
  return (
    <div
      className="panel"
      style={{
        padding: "clamp(2rem, 6vw, 3.5rem) clamp(1.25rem, 4vw, 2rem)",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {Icon && (
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--color-border)",
            background: "var(--color-surface-alt)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "1.1rem",
          }}
        >
          <Icon size={19} color="var(--color-ink-faint)" strokeWidth={1.75} />
        </div>
      )}

      <h2
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "1.15rem",
          fontWeight: 600,
          letterSpacing: "-0.02em",
          color: "var(--color-ink)",
          marginBottom: "0.5rem",
        }}
      >
        {title}
      </h2>

      <p
        style={{
          fontSize: "var(--text-sm)",
          color: "var(--color-ink-muted)",
          lineHeight: 1.65,
          maxWidth: "46ch",
          marginBottom: action || hints ? "1.5rem" : 0,
        }}
      >
        {description}
      </p>

      {hints && hints.length > 0 && (
        <ul
          style={{
            listStyle: "none",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            textAlign: "left",
            marginBottom: action ? "1.5rem" : 0,
            maxWidth: "42ch",
          }}
        >
          {hints.map((h, i) => (
            <li
              key={i}
              style={{
                display: "flex",
                gap: "0.6rem",
                fontSize: "var(--text-sm)",
                color: "var(--color-ink-muted)",
                lineHeight: 1.55,
              }}
            >
              <span className="marker" style={{ width: 20, height: 20, fontSize: "0.62rem" }}>
                {i + 1}
              </span>
              {h}
            </li>
          ))}
        </ul>
      )}

      {action}
    </div>
  );
}

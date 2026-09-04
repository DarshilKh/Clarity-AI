"use client";

import { useToastStore } from "@/store";
import { AnimatePresence, motion } from "framer-motion";
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from "lucide-react";

const iconMap = {
  success: CheckCircle2,
  error:   AlertCircle,
  info:    Info,
  warning: AlertTriangle,
};

const colorMap = {
  success: { bg: "var(--color-sage-pale)",  border: "var(--color-sage-border)",  color: "var(--color-sage)" },
  error:   { bg: "var(--color-rose-pale)",  border: "var(--color-rose-border)",  color: "var(--color-rose)" },
  info:    { bg: "var(--color-sky-pale)",   border: "#8ab8da",                   color: "var(--color-sky)" },
  warning: { bg: "var(--color-amber-pale)", border: "var(--color-amber-border)", color: "var(--color-amber)" },
};

export default function Toasts() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: "fixed",
        bottom: "clamp(1rem, 4vw, 1.5rem)",
        right: "clamp(1rem, 4vw, 1.5rem)",
        left: "clamp(1rem, 4vw, auto)",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: 8,
        pointerEvents: "none",
      }}
    >
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon  = iconMap[toast.type];
          const style = colorMap[toast.type];
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0,  scale: 1 }}
              exit={{   opacity: 0, y: 10,  scale: 0.95 }}
              transition={{ duration: 0.2 }}
              style={{
                background: style.bg,
                border: `1px solid ${style.border}`,
                borderRadius: "var(--radius-md)",
                padding: "0.75rem 0.9rem",
                display: "flex",
                alignItems: "flex-start",
                gap: "0.6rem",
                width: "min(100%, 380px)",
                boxShadow: "var(--shadow-md)",
                pointerEvents: "auto",
              }}
            >
              <Icon size={16} color={style.color} strokeWidth={2} style={{ flexShrink: 0, marginTop: 1 }} />
              <span
                style={{
                  fontSize: "var(--text-sm)",
                  color: "var(--color-ink-soft)",
                  flex: 1,
                  lineHeight: 1.5,
                }}
              >
                {toast.message}
              </span>
              <button
                onClick={() => removeToast(toast.id)}
                aria-label="Dismiss"
                style={{
                  color: "var(--color-ink-faint)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  flexShrink: 0,
                  display: "flex",
                  marginTop: 1,
                }}
              >
                <X size={14} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

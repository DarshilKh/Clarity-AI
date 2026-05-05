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
      style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999, display: "flex", flexDirection: "column", gap: 8 }}
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
                padding: "0.75rem 1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.625rem",
                minWidth: 260,
                maxWidth: 360,
                boxShadow: "0 4px 16px rgba(13,13,13,0.1)",
              }}
            >
              <Icon size={16} color={style.color} strokeWidth={2} style={{ flexShrink: 0 }} />
              <span style={{ fontSize: "0.875rem", color: "var(--color-ink-soft)", flex: 1 }}>
                {toast.message}
              </span>
              <button
                onClick={() => removeToast(toast.id)}
                style={{ color: "var(--color-ink-faint)", background: "none", border: "none", cursor: "pointer" }}
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

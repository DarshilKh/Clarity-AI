import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function stakeColor(stake: string): string {
  switch (stake) {
    case "low":      return "badge-sage";
    case "medium":   return "badge-amber";
    case "high":     return "badge-rose";
    case "critical": return "badge-rose";
    default:         return "badge-ink";
  }
}

export function stakeLabel(stake: string): string {
  return stake.charAt(0).toUpperCase() + stake.slice(1) + " Stakes";
}

export function categoryEmoji(category: string): string {
  const map: Record<string, string> = {
    career:       "💼",
    financial:    "💰",
    relationship: "❤️",
    health:       "🏥",
    education:    "🎓",
    relocation:   "🏠",
    business:     "📊",
    other:        "🔮",
  };
  return map[category] ?? "🔮";
}

export function scoreColor(score: number): string {
  if (score >= 70) return "text-sage";
  if (score >= 40) return "text-amber";
  return "text-rose";
}

export function regretBadge(risk: string): string {
  switch (risk) {
    case "low":    return "badge-sage";
    case "medium": return "badge-amber";
    case "high":   return "badge-rose";
    default:       return "badge-ink";
  }
}

export function severityBadge(severity: string): string {
  switch (severity) {
    case "low":    return "badge-sky";
    case "medium": return "badge-amber";
    case "high":   return "badge-rose";
    default:       return "badge-ink";
  }
}

export function truncate(str: string, maxLen: number): string {
  return str.length > maxLen ? str.slice(0, maxLen - 1) + "…" : str;
}

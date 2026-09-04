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

export function categoryLabel(category: string): string {
  const map: Record<string, string> = {
    career:       "Career",
    financial:    "Financial",
    relationship: "Relationship",
    health:       "Health",
    education:    "Education",
    relocation:   "Relocation",
    business:     "Business",
    other:        "Other",
  };
  return map[category] ?? "Other";
}

export function scoreColor(score: number | null): string {
  if (score === null) return "text-ink-faint";
  if (score >= 70) return "text-sage";
  if (score >= 40) return "text-amber";
  return "text-rose";
}

export function confidenceLabel(level: string): string {
  switch (level) {
    case "high":   return "High confidence";
    case "medium": return "Medium confidence";
    case "low":    return "Low confidence";
    default:       return "";
  }
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

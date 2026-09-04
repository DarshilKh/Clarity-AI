import {
  Briefcase,
  Landmark,
  Users,
  Activity,
  GraduationCap,
  Home,
  Building2,
  Compass,
} from "lucide-react";
import type { DecisionCategory } from "@/types";

// One consistent line-icon family for categories — no emoji anywhere.
export const CATEGORY_ICONS: Record<string, React.ElementType> = {
  career: Briefcase,
  financial: Landmark,
  relationship: Users,
  health: Activity,
  education: GraduationCap,
  relocation: Home,
  business: Building2,
  other: Compass,
};

export function categoryIcon(category: string): React.ElementType {
  return CATEGORY_ICONS[category] ?? Compass;
}

export const CATEGORIES: { value: DecisionCategory; label: string }[] = [
  { value: "career", label: "Career" },
  { value: "financial", label: "Financial" },
  { value: "relationship", label: "Relationship" },
  { value: "health", label: "Health" },
  { value: "education", label: "Education" },
  { value: "relocation", label: "Relocation" },
  { value: "business", label: "Business" },
  { value: "other", label: "Other" },
];

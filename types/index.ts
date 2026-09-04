// ─── Decision Core ────────────────────────────────────────────────────────────

export type DecisionStake = "low" | "medium" | "high" | "critical";

export type DecisionCategory =
  | "career"
  | "financial"
  | "relationship"
  | "health"
  | "education"
  | "relocation"
  | "business"
  | "other";

export type DecisionStatus =
  | "draft"
  | "analyzing"
  | "analyzed"
  | "decided"
  | "tracking";

export interface DecisionOption {
  id: string;
  label: string;
  description: string;
}

export interface DecisionIntake {
  title: string;
  description: string;
  category: DecisionCategory;
  stake: DecisionStake;
  timelineDays: number;   // replaces timelineWeeks — supports 1 day to 365 days
  options: DecisionOption[];
  context: string;
}

// ─── AI Analysis ──────────────────────────────────────────────────────────────

export interface BiasDetected {
  name: string;
  description: string;
  severity: "low" | "medium" | "high";
  evidence: string;
}

export interface OptionAnalysis {
  optionId: string;
  optionLabel: string;
  // 0–100, or null when the user-provided facts don't give enough
  // differentiating evidence to score this option reliably.
  expectedValue: number | null;
  // What the expectedValue is actually based on (e.g. "Weighs stated
  // compensation and flexibility priority; growth/stability unknown").
  // null when expectedValue is null — there's nothing to explain.
  scoreRationale: string | null;
  pros: string[];
  cons: string[];
  secondOrderEffects: string[];
  // Important factors for this option that matter for the decision but
  // were not provided by the user (e.g. "Not enough information provided
  // to evaluate compensation.").
  unknownFactors: string[];
  regretRisk: "low" | "medium" | "high";
}

export interface PreMortem {
  optionId: string;
  optionLabel: string;
  bestCase: string;
  worstCase: string;
  mostLikely: string;
}

// How the recommendation was reached, so the UI can render honestly:
// - "option": the provided facts give a real basis to prefer one option.
// - "phased": a staged/hybrid path beats a binary pick, grounded in stated facts.
// - "insufficient_evidence": the facts don't yet distinguish the options —
//   this is a legitimate outcome, not a failure to analyze.
export type RecommendationType = "option" | "phased" | "insufficient_evidence";

export type ConfidenceLevel = "high" | "medium" | "low";

export interface DecisionAnalysis {
  summary: string;
  recommendedOptionId: string | null;
  recommendationType: RecommendationType;
  recommendationReasoning: string;
  optionAnalyses: OptionAnalysis[];
  preMortems: PreMortem[];
  biasesDetected: BiasDetected[];
  keyQuestions: string[];
  // Concrete follow-up questions about information the user hasn't
  // provided yet that would most change this analysis.
  missingInformation: string[];
  wrapSummary: {
    widen: string;
    reality: string;
    attain: string;
    prepare: string;
  };
  confidenceScore: number; // 0–100, reflects density of grounded evidence
  confidenceLevel: ConfidenceLevel;
  // Why confidence is at this level — must name the specific unresolved
  // unknown with the greatest power to reverse the recommendation, if one
  // exists. This is what stops "high confidence" from being claimed when a
  // single missing fact could flip the answer.
  confidenceReasoning: string;
}

// ─── Stored Decision ──────────────────────────────────────────────────────────

export interface Decision {
  id: string;
  userId: string;
  intake: DecisionIntake;
  analysis: DecisionAnalysis | null;
  status: DecisionStatus;
  chosenOptionId: string | null;
  chosenReasoning: string | null;
  createdAt: string;
  updatedAt: string;
  // Outcome tracking
  outcomes: OutcomeCheckIn[];
}

export interface OutcomeCheckIn {
  id: string;
  decisionId: string;
  daysAfter: 30 | 90 | 180;
  satisfactionScore: number; // 1–10
  actualOutcome: string;
  lessonLearned: string;
  wouldChooseAgain: boolean;
  createdAt: string;
}

// ─── API Payloads ─────────────────────────────────────────────────────────────

export interface AnalyzeRequest {
  intake: DecisionIntake;
}

export interface AnalyzeResponse {
  analysis: DecisionAnalysis;
}

export interface SaveDecisionRequest {
  intake: DecisionIntake;
  analysis: DecisionAnalysis;
}

export interface RecordChoiceRequest {
  decisionId: string;
  chosenOptionId: string;
  reasoning: string;
}

export interface TrackOutcomeRequest {
  decisionId: string;
  daysAfter: 30 | 90 | 180;
  satisfactionScore: number;
  actualOutcome: string;
  lessonLearned: string;
  wouldChooseAgain: boolean;
}

// ─── UI State ─────────────────────────────────────────────────────────────────

export interface WizardStep {
  id: string;
  label: string;
  description: string;
}

export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

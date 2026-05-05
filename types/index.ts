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
  expectedValue: number; // 0–100
  pros: string[];
  cons: string[];
  secondOrderEffects: string[];
  regretRisk: "low" | "medium" | "high";
}

export interface PreMortem {
  optionId: string;
  optionLabel: string;
  bestCase: string;
  worstCase: string;
  mostLikely: string;
}

export interface DecisionAnalysis {
  summary: string;
  recommendedOptionId: string | null;
  recommendationReasoning: string;
  optionAnalyses: OptionAnalysis[];
  preMortems: PreMortem[];
  biasesDetected: BiasDetected[];
  keyQuestions: string[];
  wrapSummary: {
    widen: string;
    reality: string;
    attain: string;
    prepare: string;
  };
  confidenceScore: number; // 0–100
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

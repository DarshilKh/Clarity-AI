"use client";

import { create } from "zustand";
import type { Decision, Toast, DecisionIntake, DecisionAnalysis } from "@/types";
import { v4 as uuidv4 } from "uuid";

// ─── Toast Store ──────────────────────────────────────────────────────────────

interface ToastStore {
  toasts: Toast[];
  addToast: (type: Toast["type"], message: string) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (type, message) => {
    const id = uuidv4();
    set((s) => ({ toasts: [...s.toasts, { id, type, message }] }));
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
    }, 4000);
  },
  removeToast: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

// ─── Decision Wizard Store ────────────────────────────────────────────────────

interface WizardStore {
  step: number;
  intake: Partial<DecisionIntake>;
  analysis: DecisionAnalysis | null;
  isAnalyzing: boolean;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateIntake: (data: Partial<DecisionIntake>) => void;
  setAnalysis: (analysis: DecisionAnalysis) => void;
  setAnalyzing: (v: boolean) => void;
  reset: () => void;
}

const defaultIntake: Partial<DecisionIntake> = {
  title: "",
  description: "",
  category: "career",
  stake: "medium",
  timelineDays: 30,
  options: [
    { id: uuidv4(), label: "", description: "" },
    { id: uuidv4(), label: "", description: "" },
  ],
  context: "",
};

export const useWizardStore = create<WizardStore>((set) => ({
  step: 0,
  intake: { ...defaultIntake },
  analysis: null,
  isAnalyzing: false,
  setStep: (step) => set({ step }),
  nextStep: () => set((s) => ({ step: s.step + 1 })),
  prevStep: () => set((s) => ({ step: Math.max(0, s.step - 1) })),
  updateIntake: (data) =>
    set((s) => ({ intake: { ...s.intake, ...data } })),
  setAnalysis: (analysis) => set({ analysis }),
  setAnalyzing: (v) => set({ isAnalyzing: v }),
  reset: () =>
    set({
      step: 0,
      intake: {
        ...defaultIntake,
        options: [
          { id: uuidv4(), label: "", description: "" },
          { id: uuidv4(), label: "", description: "" },
        ],
      },
      analysis: null,
      isAnalyzing: false,
    }),
}));

// ─── Decisions Journal Store ──────────────────────────────────────────────────

interface JournalStore {
  decisions: Decision[];
  isLoading: boolean;
  setDecisions: (decisions: Decision[]) => void;
  addDecision: (decision: Decision) => void;
  updateDecision: (id: string, updates: Partial<Decision>) => void;
  setLoading: (v: boolean) => void;
}

export const useJournalStore = create<JournalStore>((set) => ({
  decisions: [],
  isLoading: false,
  setDecisions: (decisions) => set({ decisions }),
  addDecision: (decision) =>
    set((s) => ({ decisions: [decision, ...s.decisions] })),
  updateDecision: (id, updates) =>
    set((s) => ({
      decisions: s.decisions.map((d) =>
        d.id === id ? { ...d, ...updates } : d
      ),
    })),
  setLoading: (v) => set({ isLoading: v }),
}));

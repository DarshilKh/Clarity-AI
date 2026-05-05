import type { DecisionIntake, DecisionAnalysis } from "@/types";
import { createGroqClient, GROQ_MODEL } from "./groq";

export async function analyzeDecision(
  intake: DecisionIntake
): Promise<DecisionAnalysis> {
  const groq = createGroqClient();

  const systemPrompt = `You are Clarity — a brutally honest, execution-focused decision analyst. You think like a combination of a seasoned operator, a financial advisor, and a cognitive scientist.

Your job is NOT to validate what the user emotionally wants. Your job is to give the most strategically correct answer based on execution reality — money, skills, timing, market conditions, and risk-adjusted outcomes.

CORE PRINCIPLES you must follow:
1. EXECUTION REALITY FIRST: Don't optimize for emotion. Optimize for what will actually work given the user's real circumstances.
2. HYBRID PATHS: Always check if a phased or hybrid approach beats a binary choice. Most real-world decisions aren't binary.
3. RUNWAY & RESOURCES: For any decision involving financial risk, factor in capital, runway, and what happens if the plan fails at month 3.
4. SKILL READINESS: Is the person actually ready for what they're choosing? Call it out if not.
5. MARKET VALIDATION: For entrepreneurial or career bets, what's the evidence this will work? Excitement ≠ validation.
6. REGRET MINIMIZATION: What does a 80-year-old version of them regret more — trying and failing, or never trying?
7. REVERSIBILITY: How hard is it to undo this choice in 12 months? Weight reversible bets higher.
8. SECOND ORDER: What does this choice close off? What does it open up?

BIAS RULES — detect these specifically:
- Optimism bias: assuming the best case without planning for the worst
- FOMO: choosing based on fear of missing out rather than readiness
- Sunk cost: staying on a path because of past investment
- Status quo bias: preferring current state due to fear of change
- Narrative bias: making a decision because it "makes a good story" not because it's strategically sound
- Planning fallacy: underestimating time, cost, and difficulty of execution

RECOMMENDATION RULES:
- Your recommendation MUST be specific and actionable — not just "Option A is better"
- If a phased approach is better than both options, say so explicitly and describe the phases
- If the user is NOT ready for their preferred option, say so clearly and give a readiness criteria
- Never sugarcoat. Be direct. The user came here to think clearly, not to feel good.

Always respond with ONLY valid JSON. No markdown, no preamble, no explanation outside the JSON.`;

  const userPrompt = `Analyze this decision with full strategic and execution rigor. Return a JSON object.

DECISION:
Title: ${intake.title}
Category: ${intake.category}
Stakes: ${intake.stake}
Timeline: ${intake.timelineDays} day${intake.timelineDays !== 1 ? "s" : ""} to decide
Description: ${intake.description}
Additional context / fears / constraints: ${intake.context || "None provided"}

OPTIONS BEING CONSIDERED:
${intake.options.map((o, i) => `Option ${i + 1} — "${o.label}": ${o.description}`).join("\n")}

ANALYSIS INSTRUCTIONS:
For each option, you must evaluate:
- Expected value (0-100) based on REALISTIC outcome probability, not best-case
- Pros and cons grounded in execution reality, not just abstract advantages
- Second-order effects — what this choice enables or closes off 12-24 months later
- Regret risk — but factor in BOTH regret of action AND regret of inaction

For the overall recommendation:
- If a phased/hybrid path is superior to both listed options, set recommendedOptionId to null and describe the phased approach in recommendationReasoning
- Your reasoning must address: financial readiness, skill readiness, market evidence, reversibility
- Be specific about WHAT needs to be true before the riskier option becomes correct

For biases: look for optimism bias, FOMO, narrative bias, planning fallacy specifically — not just generic biases

For WRAP:
- Widen: explicitly ask if there's a hybrid/phased path not listed
- Reality: stress-test the single most dangerous assumption
- Attain: what metric or milestone would change their answer?
- Prepare: what's the specific recovery plan if this goes wrong at month 3?

Return EXACTLY this JSON structure (no extra keys, no markdown):
{
  "summary": "2-3 sentences. State the real tension in this decision — not just 'it's a tough choice' but the specific tradeoff the person is actually navigating. Be precise.",
  "recommendedOptionId": "exact option id string, OR null if phased approach is better",
  "recommendationReasoning": "3-5 sentences. Lead with the strategic reason, not the emotional one. If recommending a phase, describe: Phase 1 (what + how long), Phase 2 (trigger condition to move to next phase), Phase 3 (end state). If recommending an option, state specifically what needs to be true for this to work.",
  "optionAnalyses": [
    {
      "optionId": "option id",
      "optionLabel": "option label",
      "expectedValue": 0-100,
      "pros": ["execution-grounded pro 1", "pro 2", "pro 3"],
      "cons": ["execution-grounded con 1", "con 2", "con 3"],
      "secondOrderEffects": ["what this enables or closes off at 12-24 months", "effect 2"],
      "regretRisk": "low|medium|high"
    }
  ],
  "preMortems": [
    {
      "optionId": "option id",
      "optionLabel": "option label",
      "bestCase": "Specific, concrete best case 12 months out — what exactly happened for this to occur",
      "worstCase": "Specific, concrete worst case — what went wrong and what the damage looks like",
      "mostLikely": "The realistic median outcome — not optimistic, not catastrophic"
    }
  ],
  "biasesDetected": [
    {
      "name": "Specific bias name",
      "description": "What this bias is and why it's dangerous here",
      "severity": "low|medium|high",
      "evidence": "The exact phrase or reasoning from the user that reveals this bias"
    }
  ],
  "keyQuestions": [
    "A question that would CHANGE their answer if the answer was different than they assume",
    "A question about execution readiness they haven't asked themselves",
    "A question about the specific failure mode of their preferred option",
    "A question about what success actually looks like in 24 months"
  ],
  "wrapSummary": {
    "widen": "Is there a phased or hybrid path not listed? What would it look like specifically?",
    "reality": "What is the single most dangerous assumption they are making, and how would they test it in 2 weeks?",
    "attain": "What specific metric, milestone, or piece of evidence would make the riskier option clearly correct?",
    "prepare": "If they choose the riskier option and it fails at month 3, what is the specific recovery plan?"
  },
  "confidenceScore": 0-100
}

Option IDs: ${intake.options.map((o) => o.id).join(", ")}

Remember: your job is strategic truth, not emotional validation. If the user's preferred option requires conditions that aren't met yet, say so clearly and give them the specific conditions that need to be met first.`;

  const completion = await groq.chat.completions.create({
    model: GROQ_MODEL,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.2, // lower = more consistent, less hallucination
    max_tokens: 3500,
    response_format: { type: "json_object" },
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) throw new Error("Empty response from Groq");

  const parsed = JSON.parse(raw) as DecisionAnalysis;
  return parsed;
}

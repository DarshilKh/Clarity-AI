import type {
  DecisionIntake,
  DecisionAnalysis,
  OptionAnalysis,
  RecommendationType,
  ConfidenceLevel,
} from "@/types";
import { createGroqClient, GROQ_MODEL } from "./groq";

export async function analyzeDecision(
  intake: DecisionIntake
): Promise<DecisionAnalysis> {
  const groq = createGroqClient();

  const systemPrompt = `You are Clarity — a brutally honest, execution-focused decision analyst (operator + financial advisor + cognitive scientist). Give the most strategically correct answer based on execution reality, not what the user emotionally wants to hear.

GROUNDING RULE (overrides everything else). Never invent facts, details, or assumptions the user didn't provide. Classify every claim as:
- FACT: directly stated by the user. Stay literal — "the company is established" is a fact about being established, NOT evidence about its benefits, promotions, or layoff risk. Don't upgrade a user's word ("relatively low-risk") into a stronger claim of your own ("predictable returns").
- INFERENCE: a conclusion tightly and explainably derived from one stated fact. It settles only what it settles — e.g. "stability may reduce employment risk, but its effect on career growth is unknown" (not "stability means better career growth"). If you can't point to the fact behind it, it's fabrication, not inference.
- UNKNOWN: anything relevant not stated (company size, funding, culture, benefits, promotion timelines, equity, tech stack, etc.). Say "Not enough information provided to evaluate this" — don't soften into a guess. Treat similarly-thin options as symmetric; never invent a difference just to seem complete. Never borrow an unstated reference class ("typical for a startup") to fill a gap.

Hypotheticals stay conditional, never asserted as happening ("If Company A's position became unstable, that would raise job security risk" — not "Company A will have layoffs").

No invented thresholds — this applies to ANY specific number: currency amounts, percentages, rates, or benchmarks. If advice implies a number the user never gave ("get a job at ₹12L+ before moving", "target a 9% return"), don't state it as if it were a target or requirement — instead say what should be defined ("define the minimum compensation that would make this acceptable"). A number may appear only if the user gave it, you calculate it transparently from their numbers, or you explicitly flag it as your own assumption in the same sentence ("if you assume roughly X%, which you should set based on your own expectations, not this analysis").

Calculations must be traceable: any computed figure (loan principal, cash flow, runway, comp, investment difference) must be derived from numbers the user actually gave, with the inputs/operation shown — never approximate a plausible-sounding figure. Missing inputs → mark the result unknown.

This makes you MORE useful: every claim is one the user can act on. Where facts run out, say exactly what information would change the analysis, and analyze rigorously with what they DID give — their stated concerns, constraints, timeline, and stakes are real facts to use fully.

SCORING (expectedValue): earn scores from concrete, differentiating evidence — don't invent them for a decisive-looking chart, but don't refuse to score just because some peripheral detail is unknown (real decisions always have some). Assign a real score whenever stated facts (numbers, constraints, explicit priorities/trade-offs) support a reasoned relative judgment; use null only when there's no meaningful basis at all. Every non-null score needs scoreRationale naming the actual criteria it weighs — the score is an output of that reasoning, never its own justification. Don't force artificial gaps between close options.

CONFIDENCE: measures how much the recommendation depends on unresolved information, not writing quality or outcome optimism. Strong, consistent evidence with only minor unknowns → medium/high. A single major unresolved variable that could plausibly REVERSE the recommendation (e.g. recommending "find a job first" without knowing the timeline/odds of that) → still recommend if evidence points a direction, but cap confidence at medium and name that variable in confidenceReasoning. Almost no differentiating evidence → recommendationType "insufficient_evidence", confidence low. confidenceReasoning always states what the recommendation rests on and the single unknown most able to reverse it (or says plainly that none is likely to).

MULTI-OPTION (3+): score every option individually on the same criteria — don't silently default to the safest-sounding one. A phased/hybrid pick across 3+ options is valid only when the user's actual stated circumstances support combining them, not as a generic hedge.

DECISIVENESS: the goal is the strongest recommendation the evidence genuinely supports, not maximum caution. Don't default to "insufficient_evidence" just because some details are missing — almost every decision has gaps. Reserve it for when facts give no meaningful basis to differentiate options at all. Otherwise recommend plainly and let confidenceReasoning/unknownFactors carry the remaining risk.

CORE PRINCIPLES (within the grounding rule): execution reality over emotion; check if a stated-fact-supported phased path beats a binary choice; factor runway/capital only from given numbers; judge skill readiness from their stated background; look for stated market/validation evidence; reason regret from their stated fears; weigh reversibility and second-order effects from what's known.

BIAS RULES: flag a bias only with direct evidence in the user's own words (never diagnose the person — describe the wording/reasoning pattern that triggered it). No evidence → leave it out entirely, don't include it speculatively.

RECOMMENDATION RULES: proportional to evidence, not caution. Phased plans use only known timeline/stakes/constraints — never invented milestones. If the user isn't ready for their preferred option based on what they said, say so. Be direct about what's known; never invent what isn't.

Respond with ONLY valid JSON. No markdown, no preamble.`;

  const userPrompt = `Analyze this decision using ONLY the facts below. Do not add any company, market, or personal detail that isn't stated here. Return a JSON object.

DECISION:
Title: ${intake.title}
Category: ${intake.category}
Stakes: ${intake.stake}
Timeline: ${intake.timelineDays} day${intake.timelineDays !== 1 ? "s" : ""} to decide
Description: ${intake.description}
Additional context / fears / constraints: ${intake.context || "None provided"}

OPTIONS BEING CONSIDERED:
${intake.options.map((o, i) => `Option ${i + 1} — "${o.label}": ${o.description}`).join("\n")}

Everything above is the ENTIRE set of facts you have. Any trait of these options not stated above (size, funding, industry, tech stack, culture, benefits, promotion process, stability, team, equity, etc.) is UNKNOWN. Treat thinly-described options as symmetric on dimensions none of them addressed — don't invent a difference to seem complete.

Field-specific reminders:
- pros/cons/secondOrderEffects: traceable to a stated fact or a tight inference from one; preserve uncertainty, don't overreach.
- unknownFactors: category-appropriate missing factors, phrased "Not enough information provided to evaluate X."
- regretRisk: reason from known reversibility/stakes; use "medium" if genuinely uncertain rather than asserting false certainty.
- recommendationType: "option" (facts support one, set recommendedOptionId), "phased" (stated facts support combining, not a default), or "insufficient_evidence" (facts don't differentiate at all) — legitimate outcomes all three, per the DECISIVENESS rule.
- When recommendationType is "phased", recommendationReasoning MUST also name the condition under which the phased path would NOT be appropriate — the circumstance that would make sequencing the wrong call (e.g. if a qualification turns out to be a prerequisite for the user's target path, deferring it stops being sensible). State it as an unresolved condition to check, never as an invented fact about their situation.
- missingInformation: concrete, decision-specific follow-up questions (not boilerplate) — e.g. for a job/offer decision: compensation, role/title, work type, remote/hybrid, location, hours, team, manager, learning, promotion path, stability, benefits, notice period, bond restrictions, long-term goals — only the ones actually missing and relevant here.
- biasesDetected: only with direct evidence quoted/paraphrased from the user; empty array if none.
- preMortems.bestCase/worstCase: grounded, may explore conditional possibilities tied to the user's stated concerns ("If Company A's [stated concern] turns out poorly, then...") — never fabricate exact figures, dates, or events not supplied. Do NOT assert a MAGNITUDE the evidence can't support: no "high-paying", "higher-earning roles", "the salary increase is modest", "recoups the cost quickly", "breaks even after several years", or any implied size, speed, or payback period the user never gave. Equally, do NOT assume how something is FINANCED or what it costs — never introduce debt, loans, tuition, savings drawdown or lost income figures unless the user stated them. When magnitude is unknown, stay qualitative — "materially improves career prospects", "delivers less career or financial benefit than expected", "the cost proves hard to justify". A number, rate, cost or timeframe may appear only if the user supplied it or you label it explicitly as an assumption.
- preMortems.mostLikely: NOT a probability claim — never say "most likely" or imply odds unless the user's input actually supports a likelihood judgment. Phrase as "A plausible outcome is..."; if truly nothing is known, say the outcome can't be predicted from what's known. Use that opener ONLY here — bestCase and worstCase are already understood as scenarios and must not repeat it, or all three read identically side by side.
- wrapSummary: all four of widen/reality/attain/prepare MUST be a real non-empty sentence — if there isn't enough information for one, say that explicitly in the field ("Not enough information provided to identify a testable assumption here"); never leave one blank or thin.
- confidenceReasoning: required — name the specific unresolved unknown most able to reverse the recommendation, or state plainly that none is likely to.

Return EXACTLY this JSON structure (no extra keys, no markdown):
{
  "summary": "2-3 sentences: the real tension using only what's known, or what's clear vs. unclear if evidence is thin.",
  "recommendedOptionId": "exact option id, or null if phased/insufficient_evidence",
  "recommendationType": "option|phased|insufficient_evidence",
  "recommendationReasoning": "3-5 sentences, grounded strictly in stated facts. If option: what needs to be true for it to work. If phased: Phase 1/2/3 using only known constraints. If insufficient_evidence: what's missing and what it hinges on.",
  "optionAnalyses": [
    {
      "optionId": "option id",
      "optionLabel": "option label",
      "expectedValue": 0-100 or null,
      "scoreRationale": "criteria this score weighs, or null if expectedValue is null",
      "pros": ["grounded pro 1", "pro 2", "pro 3"],
      "cons": ["grounded con 1", "con 2", "con 3"],
      "secondOrderEffects": ["effect grounded in stated facts", "effect 2"],
      "unknownFactors": ["Not enough information provided to evaluate X", "..."],
      "regretRisk": "low|medium|high"
    }
  ],
  "preMortems": [
    { "optionId": "option id", "optionLabel": "option label", "bestCase": "...", "worstCase": "...", "mostLikely": "A plausible outcome is... (never a probability claim)" }
  ],
  "biasesDetected": [
    { "name": "Specific bias name", "description": "what it is and why it matters here", "severity": "low|medium|high", "evidence": "exact phrase/reasoning from the user's input — required, never speculative" }
  ],
  "keyQuestions": [
    "A question that would CHANGE their answer if the answer differed from what they assume",
    "A question about execution readiness they haven't asked themselves",
    "A question about the specific failure mode of their preferred option",
    "A question about what success looks like, grounded in their stated goals"
  ],
  "missingInformation": ["Concrete follow-up question about a specific missing fact that would most change this analysis"],
  "wrapSummary": {
    "widen": "Phased/hybrid path grounded in what's known, or explicit statement that not enough is known.",
    "reality": "Riskiest assumption implied by the user's own framing + a 2-week test, or explicit statement that not enough is known.",
    "attain": "What metric/milestone/evidence — described without inventing a specific number the user never gave — would resolve the uncertainty; if a number is unavoidable, flag it explicitly as an assumption, not a target. Or state that not enough is known.",
    "prepare": "Recovery approach based on known constraints, or explicit statement that not enough is known."
  },
  "confidenceScore": 0-100,
  "confidenceLevel": "high|medium|low",
  "confidenceReasoning": "What the recommendation rests on, and the specific unresolved unknown most capable of reversing it (or a plain statement that none is likely to)"
}

Option IDs: ${intake.options.map((o) => o.id).join(", ")}`;

  async function requestAnalysis(): Promise<DecisionAnalysis> {
    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.2, // lower = more consistent, less hallucination
      max_tokens: 4096,
      response_format: { type: "json_object" },
    });

    console.log(
      "[analyzeDecision] usage",
      JSON.stringify(completion.usage),
      "finish_reason",
      completion.choices[0]?.finish_reason
    );

    const raw = completion.choices[0]?.message?.content;
    if (!raw) throw new Error("Empty response from Groq");

    return normalizeAnalysis(JSON.parse(raw) as Record<string, unknown>, intake);
  }

  // json_object mode guarantees valid JSON, not a complete one — the model
  // occasionally returns a partial object (an option missing, no pre-mortems)
  // while still reporting finish_reason "stop". Rather than render a
  // half-empty analysis, retry once and keep whichever came back more
  // complete.
  const first = await requestAnalysis();
  if (completeness(first, intake) === 1) return first;

  console.warn("[analyzeDecision] incomplete response, retrying once");
  try {
    const second = await requestAnalysis();
    return completeness(second, intake) > completeness(first, intake) ? second : first;
  } catch (retryErr) {
    console.error("[analyzeDecision] retry failed, using first response", retryErr);
    return first;
  }
}

/**
 * Fraction of the expected sections that actually came back populated.
 * 1 means every option was analysed and no section is empty.
 */
function completeness(analysis: DecisionAnalysis, intake: DecisionIntake): number {
  const expectedOptions = intake.options.length;
  const checks = [
    analysis.optionAnalyses.length >= expectedOptions,
    analysis.preMortems.length >= expectedOptions,
    analysis.keyQuestions.length > 0,
    analysis.missingInformation.length > 0,
    analysis.recommendationReasoning.trim().length > 0,
    analysis.confidenceReasoning.trim().length > 0 &&
      !analysis.confidenceReasoning.startsWith("Confidence reasoning was not generated"),
  ];
  return checks.filter(Boolean).length / checks.length;
}

// The model is instructed to follow the schema exactly, but response_format
// "json_object" only guarantees valid JSON, not a specific shape — normalize
// defensively so a missing/malformed field never crashes the UI, and so
// legacy fields (e.g. a numeric-only expectedValue) are still safe. This is
// also where we guarantee no section ever renders blank: any text field that
// comes back empty gets an honest "not enough information" fallback instead
// of an empty string.
function normalizeAnalysis(
  parsed: Record<string, unknown>,
  intake: DecisionIntake
): DecisionAnalysis {
  const optionIds = new Set(intake.options.map((o) => o.id));

  const rawOptionAnalyses = Array.isArray(parsed.optionAnalyses)
    ? parsed.optionAnalyses.filter(isPlainObject)
    : [];

  const optionAnalyses: OptionAnalysis[] = rawOptionAnalyses.map((raw) => {
    const o = raw as Record<string, unknown>;
    const expectedValue = clampScore(o.expectedValue);
    const scoreRationale =
      expectedValue !== null && typeof o.scoreRationale === "string" && o.scoreRationale.trim()
        ? o.scoreRationale.trim()
        : null;

    return {
      optionId: String(o.optionId ?? ""),
      optionLabel: String(o.optionLabel ?? ""),
      expectedValue,
      scoreRationale,
      pros: toStringArray(o.pros),
      cons: toStringArray(o.cons),
      secondOrderEffects: toStringArray(o.secondOrderEffects),
      unknownFactors: toStringArray(o.unknownFactors),
      regretRisk: normalizeEnum(o.regretRisk, ["low", "medium", "high"], "medium"),
    };
  });

  const recommendedOptionId =
    typeof parsed.recommendedOptionId === "string" &&
    optionIds.has(parsed.recommendedOptionId)
      ? parsed.recommendedOptionId
      : null;

  const recommendationType = normalizeEnum<RecommendationType>(
    parsed.recommendationType,
    ["option", "phased", "insufficient_evidence"],
    recommendedOptionId ? "option" : "insufficient_evidence"
  );

  const confidenceScoreRaw = clampScore(parsed.confidenceScore) ?? 40;

  const confidenceLevel = normalizeEnum<ConfidenceLevel>(
    parsed.confidenceLevel,
    ["high", "medium", "low"],
    confidenceScoreRaw >= 70 ? "high" : confidenceScoreRaw >= 40 ? "medium" : "low"
  );

  const wrap = (parsed.wrapSummary ?? {}) as Record<string, unknown>;

  return {
    summary: withFallback(parsed.summary, "No summary was generated for this analysis."),
    recommendedOptionId,
    recommendationType,
    recommendationReasoning: withFallback(
      parsed.recommendationReasoning,
      "No recommendation reasoning was generated for this analysis."
    ),
    optionAnalyses,
    preMortems: Array.isArray(parsed.preMortems)
      ? parsed.preMortems.filter(isPlainObject).map((p) => {
          const pm = p as Record<string, unknown>;
          return {
            optionId: String(pm.optionId ?? ""),
            optionLabel: String(pm.optionLabel ?? ""),
            bestCase: withFallback(
              pm.bestCase,
              "Not enough information provided to project a best-case scenario for this option."
            ),
            worstCase: withFallback(
              pm.worstCase,
              "Not enough information provided to project a worst-case scenario for this option."
            ),
            mostLikely: withFallback(
              pm.mostLikely,
              "Not enough information provided to describe a plausible outcome for this option."
            ),
          };
        })
      : [],
    biasesDetected: Array.isArray(parsed.biasesDetected)
      ? parsed.biasesDetected.filter(isPlainObject).map((b) => {
          const bias = b as Record<string, unknown>;
          return {
            name: String(bias.name ?? ""),
            description: String(bias.description ?? ""),
            severity: normalizeEnum(bias.severity, ["low", "medium", "high"], "low"),
            evidence: String(bias.evidence ?? ""),
          };
        })
      : [],
    keyQuestions: toStringArray(parsed.keyQuestions),
    missingInformation: toStringArray(parsed.missingInformation),
    wrapSummary: {
      widen: withFallback(wrap.widen, "No hybrid or phased path is clearly supported by the information provided."),
      reality: withFallback(
        wrap.reality,
        "Not enough information provided to identify a specific risky assumption to test."
      ),
      attain: withFallback(
        wrap.attain,
        "Not enough information provided to define a concrete resolving metric."
      ),
      prepare: withFallback(
        wrap.prepare,
        "Not enough information provided to define a specific recovery plan."
      ),
    },
    confidenceScore: confidenceScoreRaw,
    confidenceLevel,
    confidenceReasoning: withFallback(
      parsed.confidenceReasoning,
      "Confidence reasoning was not generated for this analysis."
    ),
  };
}

function normalizeEnum<T extends string>(
  value: unknown,
  allowed: readonly T[],
  fallback: T
): T {
  return typeof value === "string" && (allowed as readonly string[]).includes(value)
    ? (value as T)
    : fallback;
}

// The model is instructed to emit numbers, but json_object mode doesn't
// enforce types strictly — accept numeric strings defensively too.
function clampScore(value: unknown): number | null {
  const n = typeof value === "number" ? value : typeof value === "string" ? Number(value) : NaN;
  return Number.isFinite(n) ? Math.max(0, Math.min(100, n)) : null;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

// json_object mode occasionally emits a stray non-string entry in an array
// (e.g. an empty string, a number, a null) — drop anything that isn't a
// usable string rather than let it become "undefined" or "[object Object]"
// in the rendered UI.
function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((v) => typeof v === "string" && v.trim().length > 0)
    .map((v) => v as string);
}

// Guarantees a section never renders with a blank body: an empty/missing
// string is replaced with an honest "not enough information" style note
// instead of silently rendering a heading with nothing under it.
function withFallback(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : fallback;
}

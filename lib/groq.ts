import Groq from "groq-sdk";

// Instantiated server-side only (never expose API key to client)
export function createGroqClient(): Groq {
  return new Groq({
    apiKey: process.env.GROQ_API_KEY!,
  });
}

// llama-3.3-70b-versatile was decommissioned by Groq; gpt-oss-120b is the
// current largest instruction-following model available on this account.
export const GROQ_MODEL = "openai/gpt-oss-120b";

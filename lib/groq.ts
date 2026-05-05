import Groq from "groq-sdk";

// Instantiated server-side only (never expose API key to client)
export function createGroqClient(): Groq {
  return new Groq({
    apiKey: process.env.GROQ_API_KEY!,
  });
}

// Latest stable Groq model as of 2026
export const GROQ_MODEL = "llama-3.3-70b-versatile";

// src/lib/openai.ts
import OpenAI from "openai";

// Expect OPENAI_API_KEY to be present
if (!process.env.OPENAI_API_KEY) {
  // Fail fast during boot (useful in dev)
  throw new Error("Missing OPENAI_API_KEY in environment");
}

// Export a single client instance for reuse
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

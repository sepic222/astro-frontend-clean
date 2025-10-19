// src/services/ai.ts
import { openai } from "../lib/openai";

export async function askChat(prompt: string) {
  const resp = await openai.chat.completions.create({
    model: "gpt-4o-mini", // good quality/price; switch if you prefer
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: prompt },
    ],
  });

  const msg = resp.choices?.[0]?.message?.content ?? "";
  return msg.trim();
}

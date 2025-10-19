export type SurveyAnswer =
| { questionKey: string; optionValues: string[] }   // radio/checkbox
| { questionKey: string; answerText: string };      // text

// Map your form keys to DB question keys
const KEYMAP: Record<string, string> = {
// section2 (Attraction & Self-Casting)
gender: "casting.gender",
attraction_style: "casting.attraction_style",
love_o_meter: "casting.love_o_meter",
life_role: "casting.movie_role",            // change if your DB key differs
escapism_style: "casting.escapism_style",
first_obsession_text: "casting.first_obsession", // text answer
// Add the rest as you connect sections…
};

export function buildAnswersFromForm(survey: any): SurveyAnswer[] {
const a: SurveyAnswer[] = [];

// section2 fields (adjust as you wire more)
const s2 = survey?.section2 ?? {};

// radio (single → one-element optionValues array)
if (s2.gender) {
  a.push({ questionKey: KEYMAP.gender, optionValues: [s2.gender] });
}
if (s2.love_o_meter) {
  a.push({ questionKey: KEYMAP.love_o_meter, optionValues: [s2.love_o_meter] });
}

// checkbox (arrays)
if (Array.isArray(s2.attraction_style) && s2.attraction_style.length) {
  a.push({ questionKey: KEYMAP.attraction_style, optionValues: s2.attraction_style });
}
if (Array.isArray(s2.life_role) && s2.life_role.length) {
  a.push({ questionKey: KEYMAP.life_role, optionValues: s2.life_role });
}
if (Array.isArray(s2.escapism_style) && s2.escapism_style.length) {
  a.push({ questionKey: KEYMAP.escapism_style, optionValues: s2.escapism_style });
}

// text
if (s2.first_obsession_text && s2.first_obsession_text.trim()) {
  a.push({ questionKey: KEYMAP.first_obsession_text, answerText: s2.first_obsession_text.trim() });
}

return a;
}

export async function submitSurvey(params: {
userEmail?: string | null;
answers: SurveyAnswer[];
}) {
const base = import.meta.env.VITE_API_BASE || "http://localhost:3001";
const res = await fetch(`${base}/api/survey/submit`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(params),
});
if (!res.ok) {
  const text = await res.text().catch(() => "");
  throw new Error(`Submit failed: ${res.status} ${text}`);
}
return res.json();
}

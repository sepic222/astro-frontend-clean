// src/lib/api.js
export async function submitSurvey({ email, chartId, answers, version = 'v1' }) {
    const res = await fetch('http://localhost:3001/api/survey/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, chartId, answers, version })
    });
    if (!res.ok) throw new Error(`Survey submit failed: ${res.status}`);
    return res.json(); // { ok: true, id: ... }
  }
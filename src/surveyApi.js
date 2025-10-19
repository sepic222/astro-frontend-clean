// src/lib/surveyApi.js
export async function submitSurvey(payload) {
    const res = await fetch('http://localhost:3001/api/survey', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.error || 'Failed to submit survey');
    return data;
  }
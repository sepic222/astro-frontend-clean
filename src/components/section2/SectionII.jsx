// src/components/section2/SectionII.jsx
import React, { useMemo, useState } from "react";
import { section2Questions } from "./questions";
import { useSurvey } from "../../survey/SurveyContext";
function Radio({ name, value, checked, onChange, label }) {
  return (
    <label style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={(e) => onChange(e.target.value)}
      />
      <span>{label}</span>
    </label>
  );
}
function Checkbox({ name, value, checked, onChange, label }) {
  return (
    <label style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
      <input
        type="checkbox"
        name={name}
        value={value}
        checked={checked}
        onChange={(e) => onChange(value, e.target.checked)}
      />
      <span>{label}</span>
    </label>
  );
}

export default function SectionII({ onPrevious, onContinue }) {
  const { surveyData, updateSurvey } = useSurvey();

  const initial = useMemo(() => {
    const base = {};
    section2Questions.forEach((q) => {
      base[q.key] = q.type === "multi" ? [] : "";
      if (q.otherKey) base[q.otherKey] = "";
    });
    return { ...base, ...(surveyData?.section2 || {}) };
  }, [surveyData]);

  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});

  const setSingle = (key, v) => setValues((s) => ({ ...s, [key]: v }));
  const setOther = (key, v) => setValues((s) => ({ ...s, [key]: v }));
  const setMulti = (key, v, isOn) =>
    setValues((s) => {
      const cur = new Set(s[key] || []);
      if (isOn) cur.add(v);
      else cur.delete(v);
      return { ...s, [key]: Array.from(cur) };
    });

  const validate = () => {
    const err = {};
    // simple minimal validation: require gender + love_o_meter
    if (!values.gender) err.gender = "Please pick your gender (or Other).";
    if (!values.love_o_meter) err.love_o_meter = "Pick one.";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    // for now, just stash in localStorage so nothing breaks
    localStorage.setItem("section2", JSON.stringify(values));

    // if parent provided a handler, pass the payload upward
    const payload = {
      section: "section2",
      ...values,
    };

    updateSurvey({ section2: values });

    if (onContinue) onContinue(payload);
    else alert("Captured Section II!\n\n" + JSON.stringify(payload, null, 2));
  };

  return (
    <div style={{ background: "#0e0e0f", color: "#fff", minHeight: "100vh" }}>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 20px 80px" }}>
        <h2 style={{ marginBottom: 4 }}>Section II</h2>
        <h3 style={{ marginTop: 0 }}>Attraction &amp; Self-casting</h3>
        <p style={{ opacity: 0.8 }}>
          Who you are. Who you want. Who you play in the movie of life.
        </p>

        {section2Questions.map((q) => (
          <section
            key={q.key}
            style={{
              marginTop: 28,
              paddingTop: 16,
              borderTop: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <h4 style={{ margin: "0 0 6px" }}>{q.title}</h4>
            {q.subtitle && (
              <div style={{ opacity: 0.8, marginBottom: 10 }}>{q.subtitle}</div>
            )}
            {q.helper && (
              <div style={{ opacity: 0.7, fontSize: 14, marginBottom: 10 }}>
                {q.helper}
              </div>
            )}

            {q.type === "single" &&
              q.options.map((opt) => (
                <div key={opt.value} style={{ margin: "6px 0" }}>
                  <Radio
                    name={q.key}
                    value={opt.value}
                    checked={values[q.key] === opt.value}
                    onChange={(v) => setSingle(q.key, v)}
                    label={opt.label}
                  />
                </div>
              ))}

            {q.type === "multi" &&
              q.options.map((opt) => (
                <div key={opt.value} style={{ margin: "6px 0" }}>
                  <Checkbox
                    name={q.key}
                    value={opt.value}
                    checked={(values[q.key] || []).includes(opt.value)}
                    onChange={(v, on) => setMulti(q.key, v, on)}
                    label={opt.label}
                  />
                </div>
              ))}

            {q.type === "text" && (
              <textarea
                value={values[q.otherKey]}
                onChange={(e) => setOther(q.otherKey, e.target.value)}
                placeholder="Type your answer here"
                rows={4}
                style={{
                  width: "100%",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "#fff",
                  borderRadius: 10,
                  padding: 12,
                  marginTop: 8,
                }}
              />
            )}

            {q.otherKey && q.type !== "text" && (
              <div style={{ marginTop: 8 }}>
                <div style={{ fontSize: 14, opacity: 0.9, marginBottom: 6 }}>
                  Other (optional)
                </div>
                <input
                  type="text"
                  value={values[q.otherKey]}
                  onChange={(e) => setOther(q.otherKey, e.target.value)}
                  placeholder="Type your answer here"
                  style={{
                    width: "100%",
                    height: 40,
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: "#fff",
                    borderRadius: 10,
                    padding: "0 12px",
                  }}
                />
              </div>
            )}

            {errors[q.key] && (
              <div style={{ color: "#ff6868", marginTop: 8 }}>{errors[q.key]}</div>
            )}
          </section>
        ))}

        <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
          <button
            type="button"
            onClick={onPrevious}
            style={{
              flex: 1,
              height: 44,
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.2)",
              background: "transparent",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Previous Page
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            style={{
              flex: 1,
              height: 44,
              borderRadius: 999,
              border: "none",
              background: "#ff6a00",
              color: "#fff",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
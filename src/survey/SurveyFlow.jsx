// src/survey/SurveyFlow.jsx
import React, { useMemo, useState, useCallback } from "react";
import { SectionII } from "../components/section2";
import { useSurvey } from "./SurveyContext";
import { api } from "../utils/api";
// ────────────────────────────────────────────────────────────────────────────────
// Inline placeholder sections so we can wire the full 15-step skeleton quickly.
// We'll swap these for real screens as we build each section.
// ────────────────────────────────────────────────────────────────────────────────

function StartScreen({ onContinue }) {
  return (
    <div style={{ color: "#fff", padding: 24, textAlign: "center" }}>
      <h1 style={{ marginTop: 0 }}>FateFlix</h1>
      <p style={{ opacity: 0.8 }}>✨ Lights. Camera. Astrology. ✨</p>
      <div style={{ marginTop: 24 }}>
        <button onClick={onContinue}>Enter</button>
      </div>
    </div>
  );
}

function Welcome({ onContinue }) {
  return (
    <div style={{ color: "#fff", padding: 24 }}>
      <h1 style={{ marginTop: 0 }}>Welcome</h1>
      <p style={{ opacity: 0.8 }}>Quick vibe-setter before we begin.</p>
      <div style={{ marginTop: 24 }}>
        <button onClick={onContinue}>Continue</button>
      </div>
    </div>
  );
}

function SectionI({ onContinue, onPrevious }) {
  return (
    <div style={{ color: "#fff", padding: 24 }}>
      <h1 style={{ marginTop: 0 }}>Section I (placeholder)</h1>
      <p style={{ opacity: 0.8 }}>Intro questions we’ll add later.</p>
      <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
        <button onClick={onPrevious}>Back</button>
        <button onClick={onContinue}>Continue</button>
      </div>
    </div>
  );
}

function BirthDataPlaceholder({ onContinue, onPrevious }) {
  return (
    <div style={{ color: "#fff", padding: 24 }}>
      <h1 style={{ marginTop: 0 }}>Birth Data</h1>
      <p style={{ opacity: 0.8 }}>
        We already have the dedicated Birth form screen in the app. This is a
        placeholder in the survey flow; later we can embed or deep-link to it.
      </p>
      <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
        <button onClick={onPrevious}>Back</button>
        <button onClick={onContinue}>Continue</button>
      </div>
    </div>
  );
}

function makeSimpleSection(title) {
  return function SimpleSection({ onContinue, onPrevious }) {
    return (
      <div style={{ color: "#fff", padding: 24 }}>
        <h1 style={{ marginTop: 0 }}>{title}</h1>
        <p style={{ opacity: 0.8 }}>Placeholder — wire real questions soon.</p>
        <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
          <button onClick={onPrevious}>Back</button>
          <button onClick={onContinue}>Continue</button>
        </div>
      </div>
    );
  };
}

const SectionIII = makeSimpleSection("Section III (placeholder)");
const SectionIV = makeSimpleSection("Section IV (placeholder)");
const SectionV = makeSimpleSection("Section V (placeholder)");
const SectionVI = makeSimpleSection("Section VI (placeholder)");
const SectionVII = makeSimpleSection("Section VII (placeholder)");
const SectionVIII = makeSimpleSection("Section VIII (placeholder)");

function SwipeSection({ onContinue, onPrevious }) {
  return (
    <div style={{ color: "#fff", padding: 24 }}>
      <h1 style={{ marginTop: 0 }}>Swipe (placeholder)</h1>
      <p style={{ opacity: 0.8 }}>
        This will be the 1–5 image-choice interaction. For now, continue.
      </p>
      <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
        <button onClick={onPrevious}>Back</button>
        <button onClick={onContinue}>Continue</button>
      </div>
    </div>
  );
}

function SectionXIEmail({ onContinue, onPrevious }) {
  const { surveyData, updateSurvey } = useSurvey();
  const email = surveyData?.email ?? "";

  return (
    <div style={{ color: "#fff", padding: 24 }}>
      <h1 style={{ marginTop: 0 }}>Email</h1>
      <p style={{ opacity: 0.8 }}>Where should we send your mini‑reading?</p>
      <input
        type="email"
        value={email}
        onChange={(e) => updateSurvey({ email: e.target.value })}
        placeholder="you@example.com"
        style={{
          padding: 10,
          width: 280,
          borderRadius: 8,
          border: "1px solid #333",
          background: "#0e0e0e",
          color: "#fff",
          marginTop: 12,
        }}
      />
      <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
        <button onClick={onPrevious}>Back</button>
        <button onClick={onContinue}>Continue</button>
      </div>
    </div>
  );
}

function FinalScreen({ onContinue, onPrevious }) {
  const { surveyData } = useSurvey();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    try {
      setSubmitting(true);
      setError("");

      const res = await fetch(api("/api/survey/submit"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // send everything we’ve collected so far
        body: JSON.stringify({ survey: surveyData }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error || "Failed to submit survey.");
      }

      // stash the server response for the Thank You screen (optional)
      window.__surveySubmission = data;

      onContinue(); // advance to "thankyou"
    } catch (e) {
      console.error("Submit error:", e);
      setError(e.message || "Unknown error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{ color: "#fff", padding: 24 }}>
      <h1 style={{ marginTop: 0 }}>Final Screen</h1>
      <p style={{ opacity: 0.8 }}>
        When you click submit, we’ll send your answers to the server.
      </p>

      <pre
        style={{
          background: "#111",
          border: "1px solid #222",
          borderRadius: 8,
          padding: 12,
          maxHeight: 220,
          overflow: "auto",
          marginTop: 16,
          fontSize: 12,
        }}
      >
        {JSON.stringify(surveyData, null, 2)}
      </pre>

      {error && (
        <div style={{ color: "#ff6b6b", marginTop: 12 }}>⚠ {error}</div>
      )}

      <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
        <button onClick={onPrevious} disabled={submitting}>
          Back
        </button>
        <button onClick={handleSubmit} disabled={submitting}>
          {submitting ? "Submitting…" : "Submit"}
        </button>
      </div>
    </div>
  );
}

function ThankYou({ onRestart }) {
  const { resetSurvey } = useSurvey();
  const submission = typeof window !== "undefined" ? window.__surveySubmission : null;
  return (
    <div style={{ color: "#fff", padding: 24, textAlign: "center" }}>
      <h1 style={{ marginTop: 0 }}>Thank you 💌</h1>
      <p style={{ opacity: 0.8 }}>Your form was submitted.</p>
      {submission?.id && (
        <p style={{ opacity: 0.7, fontSize: 12 }}>Ref: {submission.id}</p>
      )}
      <div style={{ marginTop: 24 }}>
        <button
          onClick={() => {
            resetSurvey();
            onRestart();
          }}
        >
          Start Over
        </button>
      </div>
    </div>
  );
}

export default function SurveyFlow() {
  const { surveyData, updateSurvey, resetSurvey } = useSurvey();
  // The ordered list of steps for the 15‑screen flow
  const steps = useMemo(
    () => [
      "start",      // 1
      "welcome",    // 2
      "section1",   // 3
      "birth",      // 4 (placeholder – we can deep-link to BirthForm later)
      "section2",   // 5 (real UI wired already)
      "section3",   // 6
      "section4",   // 7
      "section5",   // 8
      "section6",   // 9
      "section7",   // 10
      "swipe",      // 11
      "section8",   // 12
      "section11",  // 13 (Email)
      "final",      // 14
      "thankyou",   // 15
    ],
    []
  );

  const [index, setIndex] = useState(0);
  const step = steps[index];

  // hold all survey answers here (we start with Section II only)

  console.log(`SurveyFlow → index=${index} / ${steps.length}, step=${step}`);
 
  const goNext = useCallback(() => {
    setIndex((i) => Math.min(i + 1, steps.length - 1));
  }, [steps.length]);

  const goPrev = useCallback(() => {
    setIndex((i) => Math.max(i - 1, 0));
  }, []);

  const restart = useCallback(() => {
    setIndex(0);
  }, []);

  const pretty = {
    start: "Start",
    welcome: "Welcome",
    section1: "Section I",
    birth: "Birth Data",
    section2: "Section II",
    section3: "Section III",
    section4: "Section IV",
    section5: "Section V",
    section6: "Section VI",
    section7: "Section VII",
    swipe: "Swipe",
    section8: "Section VIII",
    section11: "Email",
    final: "Final",
    thankyou: "Thank You",
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        color: "#fff",
        overflowY: "auto",
      }}
    >
      {/* Simple breadcrumb */}
      <div
        style={{
          padding: "12px 16px",
          background: "#161616",
          borderBottom: "1px solid #222",
          display: "flex",
          alignItems: "center",
          gap: 12,
          position: "sticky",
          top: 0,
          zIndex: 1,
        }}
      >
        <strong>Survey</strong>
        <span style={{ opacity: 0.7 }}>
          Step {index + 1} / {steps.length} ({pretty[step]})
        </span>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <button disabled={index === 0} onClick={goPrev}>
            Back
          </button>
          <button disabled={index === steps.length - 1} onClick={goNext}>
            Next
          </button>
        </div>
      </div>

      {/* Step content */}
      {step === "start" && <StartScreen onContinue={goNext} />}

      {step === "welcome" && <Welcome onContinue={goNext} />}

      {step === "section1" && (
        <SectionI onPrevious={goPrev} onContinue={goNext} />
      )}

      {step === "birth" && (
        <BirthDataPlaceholder onPrevious={goPrev} onContinue={goNext} />
      )}
      
      {step === "section2" && (
  <SectionII
    initialValues={surveyData?.section2}
    onPrevious={goPrev}
    onContinue={(payload) => {
      updateSurvey({ section2: payload });
      goNext();
    }}
  />
)}

      {step === "section3" && (
        <SectionIII onPrevious={goPrev} onContinue={goNext} />
      )}
      {step === "section4" && (
        <SectionIV onPrevious={goPrev} onContinue={goNext} />
      )}
      {step === "section5" && (
        <SectionV onPrevious={goPrev} onContinue={goNext} />
      )}
      {step === "section6" && (
        <SectionVI onPrevious={goPrev} onContinue={goNext} />
      )}
      {step === "section7" && (
        <SectionVII onPrevious={goPrev} onContinue={goNext} />
      )}

      {step === "swipe" && (
        <SwipeSection onPrevious={goPrev} onContinue={goNext} />
      )}

      {step === "section8" && (
        <SectionVIII onPrevious={goPrev} onContinue={goNext} />
      )}

      {step === "section11" && (
        <SectionXIEmail onPrevious={goPrev} onContinue={goNext} />
      )}

      {step === "final" && (
        <FinalScreen onPrevious={goPrev} onContinue={goNext} />
      )}

      {step === "thankyou" && <ThankYou onRestart={restart} />}
    </div>
  );
}
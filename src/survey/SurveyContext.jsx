// src/components/survey/SurveyContext.jsx
import React, { createContext, useContext, useMemo, useState, useCallback } from "react";

const SurveyCtx = createContext(null);

export function SurveyProvider({ children }) {
  // one place to hold all survey answers across sections
  const [surveyData, setSurveyData] = useState({
    // section2: {...}, section3: {...}, etc. will be merged in
  });

  // merge helper: updateSurvey({ section2: {...} })
  const updateSurvey = useCallback((partial) => {
    setSurveyData((prev) => ({ ...prev, ...partial }));
  }, []);

  const value = useMemo(() => ({ surveyData, updateSurvey }), [surveyData, updateSurvey]);

  return <SurveyCtx.Provider value={value}>{children}</SurveyCtx.Provider>;
}

export function useSurvey() {
  const ctx = useContext(SurveyCtx);
  if (!ctx) {
    throw new Error("useSurvey must be used within a <SurveyProvider>");
  }
  return ctx;
}
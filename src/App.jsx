import React, { useState } from 'react';
import BirthForm from './components/BirthForm';        // old, working form
import BirthFormNew from './components/BirthFormNew';  // new design
import Chart from './components/Chart';                // shows results
import { SectionII } from './components/section2';
import { SurveyProvider } from "./survey/SurveyContext";
import SurveyFlow from './survey/SurveyFlow';

export default function App() {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [useNewForm, setUseNewForm] = useState(true);   // safe toggle for new UI
  const [showSection2, setShowSection2] = useState(false); // floating button toggle
  const [showSurvey, setShowSurvey] = useState(false);     // toggle full SurveyFlow

  return (
    <SurveyProvider>
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 16, display: 'flex', gap: 12, alignItems: 'center' }}>
        <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input
            type="checkbox"
            checked={useNewForm}
            onChange={(e) => setUseNewForm(e.target.checked)}
          />
          Use NEW Birth Form (safe toggle)
        </label>
        {loading && <span>⏳ Working…</span>}
      </div>

      {useNewForm ? (
        <BirthFormNew
          setChartData={setChartData}
          setLoading={setLoading}
          loading={loading}
        />
      ) : (
        <BirthForm
          setChartData={setChartData}
          setLoading={setLoading}
          loading={loading}
        />
      )}

      <div style={{ marginTop: 24 }}>
        {chartData ? <Chart data={chartData} /> : <p>No chart data yet</p>}
      </div>

      {/* Floating toggle button for Section II */}
      <button
        onClick={() => setShowSection2((s) => !s)}
        style={{ position: 'fixed', right: 12, bottom: 12, zIndex: 9999 }}
      >
        {showSection2 ? 'Hide Section II' : 'Show Section II'}
      </button>

      {showSection2 && (
        <SectionII
          onPrevious={() => setShowSection2(false)}
          onContinue={(payload) => {
            console.log('Section II payload:', payload);
            setShowSection2(false);
            // later: send to backend here
          }}
        />
      )}

      {/* Floating toggle for full Survey Flow (safe preview) */}
      <button
        onClick={() => setShowSurvey(true)}
        style={{ position: 'fixed', right: 12, bottom: 56, zIndex: 10000 }}
      >
        Open Survey Flow
      </button>

      {showSurvey && (
  <div
    style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.75)',
      zIndex: 10001,
      display: 'flex',
      alignItems: 'stretch',
      justifyContent: 'center'
    }}
  >
    <div style={{ flex: 1, background: '#0e0e0e' }}>
      <SurveyFlow />
    </div>
    <button
      onClick={() => setShowSurvey(false)}
      style={{
        position: 'fixed',
        top: 12,
        right: 12,
        zIndex: 10002
      }}
    >
      Close
    </button>
  </div>
)}
    </div>
    </SurveyProvider>
  );
}
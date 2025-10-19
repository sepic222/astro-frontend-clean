// src/components/Chart.jsx
import React from "react";

export default function Chart({ data }) {
  // Tiny placeholder so the app compiles; we can replace with your real chart later.
  if (!data) return <div style={{padding: 12}}>No chart data yet.</div>;
  return (
    <pre style={{ padding: 12, background: "#111", color: "#fff", borderRadius: 8, overflowX: "auto" }}>
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}
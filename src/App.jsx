import BirthForm from './components/BirthForm.jsx';
import ChartResults from './components/ChartResults.jsx';
import ComingSoon from './components/ComingSoon.jsx';
import { useState } from 'react';

export default function App() {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="container">
      <h1>Astrology Chart Generator</h1>
      <BirthForm setChartData={setChartData} setLoading={setLoading} loading={loading} />
      {loading && <p>Loading...</p>}
      {chartData && <ChartResults data={chartData} />}
      <ComingSoon />
    </div>
  );
}

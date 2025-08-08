import { longitudeToZodiac } from '../utils/zodiac';

const zodiacIcons = {
  Aries: "♈",
  Taurus: "♉",
  Gemini: "♊",
  Cancer: "♋",
  Leo: "♌",
  Virgo: "♍",
  Libra: "♎",
  Scorpio: "♏",
  Sagittarius: "♐",
  Capricorn: "♑",
  Aquarius: "♒",
  Pisces: "♓"
};

export default function ChartResults({ data }) {
  if (!data) return <p>No chart data yet.</p>;
  if (!data.success) return <p>Error fetching chart!</p>;

  console.log("📊 chartData received in ChartResults:", data);

  const sectionStyle = {
    marginTop: '1.5em',
    padding: '1em',
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: '#1e1e1e',
    color: '#fff'
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '0.5em',
    marginTop: '0.5em'
  };

  const itemStyle = {
    padding: '0.5em',
    backgroundColor: '#2a2a2a',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5em'
  };

  const renderWithIcon = (longitude) => {
    const sign = longitudeToZodiac(longitude);
    return (
      <>
        <span style={{ fontSize: '1.2em' }}>{zodiacIcons[sign]}</span>
        {sign}
      </>
    );
  };

  return (
    <div style={{ marginTop: '2em' }}>
      <h2 style={{ marginBottom: '1em' }}>Your Birth Chart</h2>

      <div style={sectionStyle}>
        <strong>Ascendant:</strong> {renderWithIcon(data.ascendant)}
      </div>

      <div style={sectionStyle}>
        <strong>MC:</strong> {renderWithIcon(data.mc)}
      </div>

      <div style={sectionStyle}>
        <strong>Planets:</strong>
        <div style={gridStyle}>
          {Object.entries(data.planets || {}).map(([planet, info]) => (
            <div key={planet} style={itemStyle}>
              <strong>{planet}:</strong> {renderWithIcon(info.longitude)}
            </div>
          ))}
        </div>
      </div>

      <div style={sectionStyle}>
        <strong>Houses:</strong>
        <div style={gridStyle}>
          {Object.values(data.houses || {}).map((h, i) => (
            <div key={i} style={itemStyle}>
              <strong>House {i + 1}:</strong> {renderWithIcon(h)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
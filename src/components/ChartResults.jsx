// src/components/ChartResults.jsx
import { longitudeToZodiac } from '../utils/zodiac';

const zodiacIcons = {
  Aries: "♈", Taurus: "♉", Gemini: "♊", Cancer: "♋",
  Leo: "♌", Virgo: "♍", Libra: "♎", Scorpio: "♏",
  Sagittarius: "♐", Capricorn: "♑", Aquarius: "♒", Pisces: "♓"
};

export default function ChartResults({ chartData }) {
  if (!chartData) return <p>No chart data yet.</p>;
  if (!chartData.success) return <p>Error fetching chart!</p>;

  const {
    ascendant,
    mc,
    houses = [],            // degrees
    houseSigns = [],        // sign names
    houseRulers = [],       // ruler names
    planets = {},           // { planet: { longitude, sign, house } }
    planetsByHouse = []     // [ [planets...], ... ]
  } = chartData;

  const section = {
    marginTop: '1.25rem',
    padding: '1rem',
    border: '1px solid #333',
    borderRadius: 8,
    background: '#121212',
    color: '#eee'
  };
  const grid = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '0.75rem',
    marginTop: '0.75rem'
  };
  const tile = {
    padding: '0.5rem 0.75rem',
    background: '#1c1c1c',
    borderRadius: 6
  };

  const renderSign = (sign) => (
    <span>
      <span style={{ fontSize: '1.1em', marginRight: 6 }}>
        {zodiacIcons[sign] || '•'}
      </span>
      {sign}
    </span>
  );

  const fmtDeg = (deg) => `${Number(deg).toFixed(2)}°`;

  // Prefer API-provided sign strings, fallback to computed from longitudes
const ascSign = chartData?.ascendantSign ?? renderSign(longitudeToZodiac(ascendant));
const mcSign  = chartData?.mcSign        ?? renderSign(longitudeToZodiac(mc));

  return (
    <div style={{ marginTop: '2rem' }}>
      <h2 style={{ marginBottom: '0.75rem' }}>Your Birth Chart</h2>

      <div style={section}>
      <div><strong>Ascendant (Rising):</strong> {ascSign} ({fmtDeg(ascendant)})</div>        
      <div><strong>MC (Midheaven):</strong> {mcSign} ({fmtDeg(mc)})</div>      </div>

      <div style={section}>
        <strong>Houses (cusp → sign → ruler):</strong>
        <div style={grid}>
          {houses.map((deg, i) => (
            <div key={i} style={tile}>
              <div><strong>House {i + 1}</strong></div>
              <div>Cusp: {fmtDeg(deg)}</div>
              <div>Sign: {renderSign(houseSigns[i] || longitudeToZodiac(deg))}</div>
              <div>Ruler: {houseRulers[i] || '—'}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={section}>
        <strong>Planets by House:</strong>
        <div style={grid}>
          {Array.from({ length: 12 }).map((_, i) => {
            const list = planetsByHouse[i] || [];
            return (
              <div key={i} style={tile}>
                <div><strong>House {i + 1}</strong></div>
                {list.length === 0 ? (
                  <div>—</div>
                ) : (
                  <ul style={{ margin: '6px 0 0 1rem' }}>
                    {list.map((p) => (
                      <li key={p}>
                        {p} — {renderSign(planets[p]?.sign || longitudeToZodiac(planets[p]?.longitude))}
                        {planets[p]?.longitude != null && (
                          <> ({fmtDeg(planets[p].longitude)})</>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div style={section}>
        <strong>All Planets (sign, house, degree):</strong>
        <div style={grid}>
          {Object.entries(planets).map(([name, info]) => (
            <div key={name} style={tile}>
              <div><strong>{name}</strong></div>
              <div>Sign: {renderSign(info.sign || longitudeToZodiac(info.longitude))}</div>
              <div>House: {info.house}</div>
              <div>Longitude: {fmtDeg(info.longitude)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
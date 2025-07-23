export default function ChartResults({ data }) {
    if (!data.success) return <p>Error fetching chart!</p>;
  
    return (
      <div style={{ marginTop: '2em' }}>
        <h2>Your Birth Chart</h2>
        <div>
          <strong>Ascendant:</strong> {data.ascendant}
        </div>
        <div>
          <strong>MC:</strong> {data.mc}
        </div>
        <div>
          <strong>Planets:</strong>
          <ul>
            {Object.entries(data.planets).map(([planet, info]) => (
              <li key={planet}>
                {planet}: {info.longitude?.toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <strong>Houses:</strong>
          <ul>
            {data.houses?.map((h, i) => (
              <li key={i}>House {i + 1}: {h?.toFixed(2)}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
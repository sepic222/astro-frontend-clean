import React, { useState, useRef } from 'react';
import { geocodeCity } from '../utils/geocode';

export default function BirthForm({ setChartData, setLoading, loading }) {
  const [form, setForm] = useState({
    name: '',
    date: '',
    time: '',
    country: '',
    city: '',
  });

  const [coords, setCoords] = useState({ latitude: '', longitude: '' });

  // 🧠 Debounce + request guard
  const lastReqId = useRef(0);
  const debounceTimer = useRef(null);

  // 🔄 Handle geocoding when city is typed (robust version)
  async function handleCityChange(e) {
    const city = e.target.value;
    setForm((prev) => ({ ...prev, city }));

    // Clear previous debounce
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    // If not enough characters or no country yet, clear coords and bail
    if (city.trim().length < 3 || !form.country.trim()) {
      setCoords({ latitude: '', longitude: '' });
      return;
    }

    // Debounce 300ms to avoid spamming the backend
    const reqId = ++lastReqId.current;
    debounceTimer.current = setTimeout(async () => {
      try {
        console.log('🌐 Fetching geocode for:', { city, country: form.country });
        const { latitude, longitude } = await geocodeCity(city, form.country);

        // Only accept the latest response
        if (reqId === lastReqId.current) {
          console.log('✅ Geocode OK:', { latitude, longitude });
          setCoords({ latitude, longitude });
        }
      } catch (err) {
        console.error('❌ Geocoding failed:', err);
        if (reqId === lastReqId.current) {
          setCoords({ latitude: '', longitude: '' });
        }
      }
    }, 300);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const apiUrl = 'https://astro-backend-clean-main.onrender.com/api/birth-chart-swisseph';

    console.log('🚀 Submitting form...');
    console.log('📍 Final coordinates in state:', coords);

    const body = {
      date: form.date,
      time: form.time,
      latitude: coords.latitude,
      longitude: coords.longitude,
    };

    console.log('📤 Payload to backend:', body);

    try {
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json(); 
      console.log("🎯 Birth chart response from backend:", data);
      setChartData(data);
    } catch (err) {
      alert('Error fetching chart!');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '2em' }}>
      <div>
        <label>
          Name (optional):
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </label>
      </div>

      <div>
        <label>
          Date of Birth:
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            required
          />
        </label>
      </div>

      <div>
        <label>
          Time of Birth:
          <input
            type="time"
            value={form.time}
            onChange={(e) => setForm({ ...form, time: e.target.value })}
            required
          />
        </label>
      </div>

      <div>
        <label>
          Country of Birth:
          <input
            name="country"
            value={form.country}
            onChange={(e) => setForm({ ...form, country: e.target.value })}
            required
          />
        </label>
      </div>

      <div>
        <label>
          City of Birth:
          <input
            value={form.city}
            onChange={handleCityChange}
            required
          />
        </label>
      </div>

      <div>
        <label>
          Latitude:
          <input value={coords.latitude} readOnly />
        </label>
        <label>
          Longitude:
          <input value={coords.longitude} readOnly />
        </label>
      </div>

      <button type="submit" disabled={loading}>
        Get Chart
      </button>
    </form>
  );
}
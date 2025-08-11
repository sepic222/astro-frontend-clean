import React, { useState, useRef } from 'react';
import { geocodeCity } from '../utils/geocode';
import { api } from '../utils/api';

export default function BirthForm({ setChartData, setLoading, loading }) {
  const [form, setForm] = useState({
    name: '',
    date: '',
    time: '',
    country: '',
    city: '',
  });
  const [coords, setCoords] = useState({ latitude: '', longitude: '' });
  const [errorMsg, setErrorMsg] = useState('');

  // debounced geocode
  const lastReqId = useRef(0);
  const debounceTimer = useRef(null);

  const isFormFilled = () =>
    form.date.trim() &&
    form.time.trim() &&
    form.country.trim() &&
    form.city.trim();

  const hasCoords = () =>
    coords.latitude !== '' &&
    coords.longitude !== '' &&
    !Number.isNaN(Number(coords.latitude)) &&
    !Number.isNaN(Number(coords.longitude));

  const isSubmitDisabled = () => loading || !isFormFilled() || !hasCoords();

  // geocoding on city change
  async function handleCityChange(e) {
    const city = e.target.value;
    setForm((prev) => ({ ...prev, city }));

    setErrorMsg('');

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    if (city.trim().length < 3 || !form.country.trim()) {
      setCoords({ latitude: '', longitude: '' });
      return;
    }

    const reqId = ++lastReqId.current;
    debounceTimer.current = setTimeout(async () => {
      try {
        const { latitude, longitude } = await geocodeCity(city, form.country);
        if (reqId === lastReqId.current) {
          setCoords({ latitude, longitude });
        }
      } catch (err) {
        if (reqId === lastReqId.current) {
          setCoords({ latitude: '', longitude: '' });
          setErrorMsg('Could not find that location. Please check city & country.');
        }
      }
    }, 300);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg('');

    // last guard on client
    if (!isFormFilled()) {
      setErrorMsg('Please fill date, time, country and city.');
      return;
    }
    if (!hasCoords()) {
      setErrorMsg('Coordinates are missing. Please pick a valid city.');
      return;
    }

    setLoading(true);

    const apiUrl = api('/api/birth-chart-swisseph');

    const body = {
      date: form.date,
      time: form.time,
      latitude: coords.latitude,
      longitude: coords.longitude,
    };

    try {
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        // show backend message if available
        setErrorMsg(data?.error || 'Failed to fetch birth chart.');
        setChartData(null);
        return;
      }

      setChartData(data);
    } catch (err) {
      setErrorMsg('Network error. Please try again.');
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
          <input value={form.city} onChange={handleCityChange} required />
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

      {!!errorMsg && (
        <p style={{ color: '#ff6b6b', marginTop: '0.5em' }}>{errorMsg}</p>
      )}

      <button type="submit" disabled={isSubmitDisabled()}>
        {loading ? 'Working…' : 'Get Chart'}
      </button>
    </form>
  );
}
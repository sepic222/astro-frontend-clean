import { useState } from 'react';
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

  // Simulated geocode (stub)
  async function handleCityChange(e) {
    const city = e.target.value;
    setForm({ ...form, city });

    if (city.length > 2 && form.country) {
      const { latitude, longitude } = await geocodeCity(city, form.country);
      setCoords({ latitude, longitude });
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    // Replace with your backend API URL
    const apiUrl = 'http://localhost:3001/api/birth-chart-swisseph';

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
      setChartData(data);
    } catch (err) {
      alert('Error fetching chart!');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '2em' }}>
      <div>
        <label>Name (optional): <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></label>
      </div>
      <div>
        <label>Date of Birth: <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required /></label>
      </div>
      <div>
        <label>Time of Birth: <input type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} required /></label>
      </div>
      <div>
        <label>Country of Birth: <input value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} required /></label>
      </div>
      <div>
        <label>City of Birth: <input value={form.city} onChange={handleCityChange} required /></label>
      </div>
      <div>
        <label>Latitude: <input value={coords.latitude} readOnly /></label>
        <label>Longitude: <input value={coords.longitude} readOnly /></label>
      </div>
      <button type="submit" disabled={loading}>Get Chart</button>
    </form>
  );
}
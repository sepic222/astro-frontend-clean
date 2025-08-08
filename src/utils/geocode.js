// src/utils/geocode.js
const BASE = 'https://astro-backend-clean-main.onrender.com';

export async function geocodeCity(city, country) {
  const url = `${BASE}/api/geocode?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}`;
  console.log('🌐 Fetching geocode from:', url);

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Geocoding request failed: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  if (!data.latitude || !data.longitude) {
    throw new Error('Geocoding failed: No coordinates received');
  }

  return { latitude: data.latitude, longitude: data.longitude };
}
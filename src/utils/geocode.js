// src/utils/geocode.js
import { api } from './api';

export async function geocodeCity(city, country) {
  const url = api(
    `/api/geocode?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}`
  );
  console.log('🌐 geocode fetch:', url);

  const res = await fetch(url);
  const text = await res.text().catch(() => '');

  if (!res.ok) {
    throw new Error(`Geocoding request failed: ${res.status} ${res.statusText} — ${text}`);
  }

  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch (e) {
    throw new Error(`Geocoding response was not JSON: ${text}`);
  }

  if (!data?.latitude || !data?.longitude) {
    throw new Error(`Geocoding returned no coords: ${JSON.stringify(data)}`);
  }

  return { latitude: data.latitude, longitude: data.longitude };
}
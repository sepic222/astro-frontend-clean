// src/utils/geocode.js
import { api } from './api';

export async function geocodeCity(city, country) {
  const url = api(
    `/api/geocode?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}`
  );

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Geocoding request failed: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  if (!data.latitude || !data.longitude) {
    throw new Error('Geocoding failed: No coordinates received');
  }

  return {
    latitude: data.latitude,
    longitude: data.longitude,
  };
}
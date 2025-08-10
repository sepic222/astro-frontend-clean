// src/utils/geocode.js
import { api } from "./api";

export async function geocodeCity(city, country) {
  const url = api (  `/api/geocode?city=${encodeURIComponent(city)}&country=${encodeURIComponent (country)}`);
console.log("🌐 Fetching geocode from:", url);
const response = await fetch(url);
if (!response.ok) throw new Error(`Geocoding request failed: ${response.statusText}`);
  const data = await response.json();
  if (!data.latitude || !data.longitude) {throw new Error("Geocoding failed: No coordinates received");
  }
  return { latitude: data.latitude, longitude: data.longitude };
}
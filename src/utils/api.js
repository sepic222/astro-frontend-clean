// src/utils/api.js

// Read API base from .env.local or fall back to localhost:3001
export const API_BASE =
  (import.meta.env && import.meta.env.VITE_API_BASE) || "http://localhost:3001";

console.log("🔍 API_BASE is set to:", API_BASE); // Debug: check what frontend sees

// Ensure there's no trailing slash in the base
const base = API_BASE.replace(/\/+$/, "");

// Helper function to build full API URLs
export const api = (path) => `${base}${path}`;
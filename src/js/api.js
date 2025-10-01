// src/js/api.js — Dattebayo (Naruto) API
const BASE = "https://dattebayo-api.onrender.com";

async function fetchJSON(url) {
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
}

/** Get many characters for the dropdown (bump limit to fetch all). */
export async function getCharacters({ page = 1, limit = 1000 } = {}) {
  // Docs support query params like ?page=&limit= and ?name=
  const data = await fetchJSON(
    `${BASE}/characters?page=${page}&limit=${limit}`
  );
  // Normalize: array OR { characters:[...] } OR { results:[...] }
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.characters)) return data.characters;
  if (Array.isArray(data.results)) return data.results;
  return [];
}

/** Get a single character by id (preferred) or by name (fallback). */
export async function getCharacterDetails({ id, name }) {
  // 1) Try canonical /characters/:id (docs route)
  if (id) {
    try {
      return await fetchJSON(`${BASE}/characters/${encodeURIComponent(id)}`);
    } catch {
      /* fall back to name */
    }
  }
  // 2) Fallback: query by exact/partial name via ?name=
  const q = await fetchJSON(
    `${BASE}/characters?name=${encodeURIComponent(name ?? "")}`
  );
  if (Array.isArray(q) && q.length) return q[0];
  if (q && Array.isArray(q.characters) && q.characters.length)
    return q.characters[0];
  return { id, name }; // graceful fallback
}

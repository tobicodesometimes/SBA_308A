// src/js/ui.js

export function setStatus(msg = "") {
  document.getElementById("status").textContent = msg;
}

export function renderSelect(selectEl, list) {
  const sorted = [...list].sort((a, b) =>
    (a.name || "").localeCompare(b.name || "")
  );
  const options = ['<option value="">-- Select --</option>'];
  for (let i = 0; i < sorted.length; i++)
    options.push(
      `<option value="${i}">${sorted[i]?.name ?? "Unknown"}</option>`
    );
  selectEl.innerHTML = options.join("");
  selectEl._data = sorted;
}

// Helpers
const fmt = (v) => {
  if (v == null) return "—";
  if (Array.isArray(v)) return v.length ? v.join(", ") : "—";
  if (typeof v === "object") {
    const vals = Object.values(v).flat().filter(Boolean);
    return vals.length ? vals.join(", ") : "—";
  }
  const s = String(v).trim();
  return s === "" ? "—" : s;
};
const first = (...vals) =>
  vals.find(
    (v) => v != null && (Array.isArray(v) ? v.length : String(v).trim() !== "")
  );

// Main renderer
export function renderDetails(root, c = {}) {
  const p = c.personal || {};
  const r = c.rank || {};

  const village = first(c.village, p.affiliation, p.birthplace, p.residence);
  const clan = first(c.clan, p.clan);
  const kekkei = first(c.kekkei_genkai, c.kekkeiGenkai, p.kekkeiGenkai);
  const beast = first(c.tailed_beast, c.tailedBeast, p.tailedBeast);
  const team = first(c.team, c.organization, p.team, p.affiliation);

  const ninjaRank = r.ninjaRank
    ? Object.values(r.ninjaRank).filter(Boolean).join(", ")
    : null;
  const ninjaReg = r.ninjaRegistration || null;

  // image field: Dattebayo commonly exposes `images` (array of URLs); fall back to `image`
  const imgSrc =
    Array.isArray(c.images) && c.images.length ? c.images[0] : c.image || null;
  const imgTag = imgSrc
    ? `<img src="${imgSrc}" alt="${(c.name || "Character") + " image"}">`
    : "";

  root.innerHTML = `
    <article class="card">
      ${imgTag}
      <div class="meta">
        <h2>${fmt(c.name)}</h2>
        <ul>
          <li><strong>Village:</strong> ${fmt(village)}</li>
          <li><strong>Clan:</strong> ${fmt(clan)}</li>
          <li><strong>Kekkei Genkai:</strong> ${fmt(kekkei)}</li>
          <li><strong>Tailed Beast:</strong> ${fmt(beast)}</li>
          <li><strong>Affiliation/Team:</strong> ${fmt(team)}</li>
          <li><strong>Rank:</strong> ${fmt(ninjaRank)}${
    ninjaReg ? `, ${ninjaReg}` : ""
  }</li>
        </ul>
      </div>
    </article>
  `;
}

// Boot the app: load characters then populate select then on change, fetch details.
import { getCharacters, getCharacterDetails } from "./api.js";
import { renderSelect, renderDetails, setStatus } from "./ui.js";

let lastRequestId = 0;

async function boot() {
  const select = document.getElementById("characterSelect");
  const details = document.getElementById("details");

  setStatus("Loading characters…");
  try {
    const list = await getCharacters();
    renderSelect(select, list);
    setStatus("");
  } catch (err) {
    console.error(err);
    setStatus("Could not load characters. Please refresh to retry.");
  }

  select.addEventListener("change", async (e) => {
    const idx = e.target.value;
    details.setAttribute("aria-busy", "true");

    if (idx === "") {
      details.innerHTML = "";
      details.removeAttribute("aria-busy");
      return;
    }

    const picked = select._data?.[Number(idx)] ?? {};
    const idLike = picked.id ?? picked._id ?? picked.slug; // common id shapes
    const rid = ++lastRequestId;

    setStatus("Loading details…");
    try {
      const full = await getCharacterDetails({ id: idLike, name: picked.name });
      if (rid !== lastRequestId) return; // ignore stale responses
      renderDetails(details, full);
      setStatus("");
    } catch (err) {
      if (rid !== lastRequestId) return;
      console.error(err);
      setStatus("Could not load details.");
    } finally {
      details.removeAttribute("aria-busy");
    }
  });
}

document.addEventListener("DOMContentLoaded", boot);

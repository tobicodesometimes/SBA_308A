Naruto Character Explorer

A lightweight, single-page web app that lets you pick a character from the Naruto universe and instantly see a clean bio (village, clan, kekkei genkai, tailed beast, rank, and more)—fast, simple, and powered by the Dattebayo API.

What’s Naruto?

Naruto is a manga/anime by Masashi Kishimoto about Naruto Uzumaki, an orphaned ninja who dreams of becoming Hokage; it blends coming-of-age themes with chakra-based combat, hidden villages, and unique bloodline abilities, and its sequel Boruto: Naruto Next Generations follows the next generation while branching into its own story.

Features

Dropdown character picker with A→Z sorting

Instant bio card with graceful fallbacks for missing data

Character image when available

Simple, responsive layout with accessible labels and status messaging

How It Works

On load, the app fetches GET /characters?limit=1000 from https://dattebayo-api.onrender.com
 and fills the <select>.

On selection, it tries GET /characters/:id (falls back to ?name=) and renders a details card.

Async is handled with async/await plus a tiny requestId guard so only the latest response updates the UI (avoids race conditions).

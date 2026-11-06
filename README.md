# Zidong Core 2.0 — Interface prototype

A clean, independent rebuild of the Zidong Core frontend. This stage focuses on the user interface and navigation with fictional demo data. No real user accounts, database, team scoring, or learning vocabulary is connected yet.

## Run locally

Open `index.html` in a browser for a quick preview. For PWA/service-worker testing, serve this folder through a local HTTP server (for example VS Code Live Server) or deploy it to a static host.

## Structure

- `index.html` — application shell
- `css/styles.css` — visual system and responsive layout
- `js/app.js` — navigation and screen rendering
- `js/demo-data.js` — fictional data for interface previews
- `manifest.json` and `sw.js` — PWA shell configuration
- `assets/icon.svg` — app icon

## Next stages

1. Review the interface and agree on visual changes.
2. Define the real content schema and import the vocabulary separately.
3. Select a backend/database for shared accounts, teams, and XP.
4. Implement authentication, team registration, server-authoritative XP, and leaderboards.
5. Add offline learning and queued synchronization.

The original project backup is not included in this folder; keep it separately and unchanged.

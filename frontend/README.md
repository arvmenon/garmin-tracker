# Garmin Tracker UI

Next.js 16 + Chakra UI scaffold tuned for fast, accessible dashboards.

## Development
- Install dependencies with `npm install` (Node 18+).
- Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_API_BASE_URL` (defaults to `http://localhost:8000`).
- Start the UI on port **4010**: `npm run dev`.
- Run linting before committing: `npm run lint`.

## Production
- Build: `npm run build`.
- Start: `npm run start` (serves on port **4010**).

The layout is Chakra-based with minimal global CSS for faster paints and responsive defaults for upcoming dashboard shells.

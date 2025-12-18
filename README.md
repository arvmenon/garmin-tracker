# Garmin Tracker

FastAPI backend with a Next.js + Chakra UI frontend for Garmin activity insights.

## Development
1. Create a Python 3.11 virtual environment.
2. Install backend deps: `pip install -r backend/requirements.txt`.
3. Run the API locally: `uvicorn backend.app.main:app --reload`.
4. Install frontend deps: `cd frontend && npm install` (Node 18+).
5. Copy `frontend/.env.example` to `frontend/.env.local` and set `NEXT_PUBLIC_API_BASE_URL` to your API origin.
6. Start the UI on port **4010**: `npm run dev` (production: `npm run start`, also on **4010**).
7. Run tests: `pytest` for backend; `npm run lint` for frontend.

### Docker
- Bring up the UI and API with `docker-compose up frontend api` (add `--build` on the first run).
- Services expose:
  - API: `http://localhost:8009`
  - Frontend: `http://localhost:4010`
- The compose file sets `NEXT_PUBLIC_API_BASE_URL` for the UI and `ALLOWED_ORIGINS` for the API to keep CORS aligned.

## Branching
All pull requests should target the `development` branch (not `main`).

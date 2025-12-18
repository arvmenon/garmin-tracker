# Garmin Tracker

FastAPI backend with a Next.js + Chakra UI frontend for Garmin activity insights.

## Development
1. Create a Python 3.11 virtual environment.
2. Install backend deps: `pip install -r backend/requirements.txt`.
3. (Optional) add a `.env` using `backend/.env.example` for custom DB or CORS origins.
4. Run the API locally: `uvicorn backend.app.main:app --reload`.
5. Install frontend deps: `cd frontend && npm install` (Node 18+).
6. Start the UI on port **4010**: `npm run dev`.
7. Run tests: `pytest` for backend; `npm run lint` for frontend.

Dockerized stack is available via `docker-compose up --build` (API on `http://localhost:8009` -> app port `8000`, UI on `http://localhost:4010`). If you previously created the Postgres volume, remove it (`docker volume rm garmin-tracker_pgdata`) so the bundled init script can provision the `netdata` role used by monitoring clients.

## Branching
All pull requests should target the `development` branch (not `main`).

# Garmin Tracker

FastAPI backend with a Next.js + Chakra UI frontend for Garmin activity insights.

## Development
### Environment prerequisites
- **Python:** 3.11 (for API and tests).
- **Node:** 18+ (for UI and UI tests).
- **Docker:** for Postgres/PostGIS container.
- **Docker Compose:** required to launch the stack locally.
- **Backend deps (including tests):** `pip install -r backend/requirements.txt`.
- **Frontend deps (including tests):** `cd frontend && npm install`.

### Install Docker and Docker Compose (Ubuntu)
- `sudo apt-get update`
- `sudo apt-get install -y docker.io docker-compose python3-setuptools`
  - `python3-setuptools` provides the `distutils` shim needed by the Ubuntu `docker-compose` package on Python 3.12.

1. Create a Python 3.11 virtual environment.
2. Install backend deps: `pip install -r backend/requirements.txt`.
3. Start the database (PostgreSQL + PostGIS) with `docker compose up db` and keep the container running.
   - Optional overrides: `APP_DB_NAME`, `APP_DB_USER`, `APP_DB_PASSWORD`, `READONLY_DB_USER`, `READONLY_DB_PASSWORD`.
4. Set `DATABASE_URL` to match the app role (default: `postgresql+psycopg2://garmin_app:garmin_app@localhost:5432/garmin_tracker`).
5. Run the API locally: `uvicorn backend.app.main:app --reload`.
6. Install frontend deps: `cd frontend && npm install` (Node 18+).
7. Copy `frontend/.env.example` to `frontend/.env.local` and set `NEXT_PUBLIC_API_BASE_URL` to your API origin.
8. Start the UI on port **4010**: `npm run dev` (production: `npm run start`, also on **4010**).
9. Run tests: `pytest` for backend; `npm run lint` for frontend.

### Docker
- Bring up the DB, UI, and API with `docker-compose up db frontend api` (add `--build` on the first run).
- Services expose:
  - API: `http://localhost:8009`
  - Frontend: `http://localhost:4010`
- The compose file sets `NEXT_PUBLIC_API_BASE_URL` for the UI and `ALLOWED_ORIGINS` for the API to keep CORS aligned.

## Branching
All pull requests should target the `development` branch (not `main`).

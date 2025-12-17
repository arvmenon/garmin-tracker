# Garmin Tracker

Initial FastAPI-based service scaffold for ingesting and presenting Garmin activities.

## Development
1. Create a virtual environment with Python 3.11.
2. Install dependencies: `pip install -r backend/requirements.txt`.
3. Run the API locally: `uvicorn backend.app.main:app --reload`.
4. Run tests: `pytest`.

Dockerized stack is available via `docker-compose up --build` (API on `http://localhost:8000`).

## Branching
All pull requests should target the `development` branch (not `main`).

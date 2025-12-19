from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api.router import api_router
from .core.config import get_settings
from .core.logging import configure_logging, log_startup

settings = get_settings()
configure_logging(settings)
log_startup(settings)

app = FastAPI(title=settings.app_name)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")


@app.get("/")
async def root():
    return {"message": "Welcome to Garmin Tracker API", "environment": settings.environment}

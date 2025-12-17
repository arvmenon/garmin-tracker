from datetime import datetime, timezone

from fastapi import APIRouter

from ..schemas import HealthResponse
from ...core.config import get_settings

router = APIRouter()


@router.get("", response_model=HealthResponse)
async def read_health() -> HealthResponse:
    settings = get_settings()
    return HealthResponse(
        status="ok",
        app=settings.app_name,
        environment=settings.environment,
        timestamp=datetime.now(timezone.utc),
    )

from datetime import datetime, timezone
from uuid import uuid4

from fastapi import APIRouter, Query

from ..schemas import ActivityListResponse, ActivitySummary

router = APIRouter()


@router.get("", response_model=ActivityListResponse)
async def list_activities(limit: int = Query(20, ge=1, le=100)) -> ActivityListResponse:
    samples = [
        ActivitySummary(
            id=str(uuid4()),
            type="running",
            start_time=datetime(2024, 11, 1, 6, 30, tzinfo=timezone.utc),
            duration_seconds=3600,
            distance_meters=10000,
            average_heart_rate=152,
            average_power=None,
            provider="garmin",
        ),
        ActivitySummary(
            id=str(uuid4()),
            type="cycling",
            start_time=datetime(2024, 11, 2, 7, 45, tzinfo=timezone.utc),
            duration_seconds=5400,
            distance_meters=32000,
            average_heart_rate=140,
            average_power=220,
            provider="garmin",
        ),
        ActivitySummary(
            id=str(uuid4()),
            type="running",
            start_time=datetime(2024, 11, 3, 18, 15, tzinfo=timezone.utc),
            duration_seconds=2700,
            distance_meters=5000,
            average_heart_rate=158,
            average_power=None,
            provider="garmin",
        ),
    ]
    items = samples[:limit]
    return ActivityListResponse(count=len(items), items=items)

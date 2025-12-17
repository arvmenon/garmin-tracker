from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    status: str = Field(..., description="Service health status")
    app: str = Field(..., description="Application name")
    environment: str = Field(..., description="Runtime environment")
    timestamp: datetime = Field(..., description="ISO8601 UTC timestamp of the health check")


class ActivitySummary(BaseModel):
    id: str = Field(..., description="Activity identifier")
    type: str = Field(..., description="Activity type e.g. running or cycling")
    start_time: datetime = Field(..., description="Start time in UTC")
    duration_seconds: int = Field(..., ge=0, description="Activity duration in seconds")
    distance_meters: Optional[float] = Field(None, ge=0, description="Total distance in meters")
    average_heart_rate: Optional[int] = Field(None, ge=0, description="Average heart rate in bpm")
    average_power: Optional[int] = Field(None, ge=0, description="Average power in watts")
    provider: str = Field(..., description="Source provider e.g. garmin")


class ActivityListResponse(BaseModel):
    count: int = Field(..., description="Number of activities returned")
    items: List[ActivitySummary] = Field(default_factory=list)

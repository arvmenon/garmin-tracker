from fastapi import APIRouter

from . import health, activities

router = APIRouter()
router.include_router(health.router, prefix="/health", tags=["health"])
router.include_router(activities.router, prefix="/activities", tags=["activities"])

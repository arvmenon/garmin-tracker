import pytest
from httpx import ASGITransport, AsyncClient

from backend.app.main import app


@pytest.mark.asyncio
async def test_activities_endpoint_returns_sample_data():
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://testserver"
    ) as client:
        response = await client.get("/api/v1/activities", params={"limit": 5})

    assert response.status_code == 200
    payload = response.json()
    assert payload["count"] == 3
    assert len(payload["items"]) == 3


@pytest.mark.asyncio
async def test_activities_endpoint_limits_value():
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://testserver"
    ) as client:
        response = await client.get("/api/v1/activities", params={"limit": 0})

    assert response.status_code == 422

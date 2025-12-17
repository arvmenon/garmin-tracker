import pytest
from httpx import ASGITransport, AsyncClient

from backend.app.main import app


@pytest.mark.asyncio
async def test_health_endpoint_returns_ok():
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://testserver"
    ) as client:
        response = await client.get("/api/v1/health")

    assert response.status_code == 200
    payload = response.json()
    assert payload["status"] == "ok"
    assert payload["app"] == "Garmin Tracker API"
    assert payload["environment"] == "development"

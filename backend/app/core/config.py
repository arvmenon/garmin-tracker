from functools import lru_cache
from typing import Any

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

DEFAULT_ALLOWED_ORIGINS = ("http://localhost:4010",)


def _normalize_origins(value: Any) -> list[str]:
    if value is None:
        return list(DEFAULT_ALLOWED_ORIGINS)

    if isinstance(value, str):
        candidates = [segment.strip() for segment in value.split(",") if segment.strip()]
        return candidates or list(DEFAULT_ALLOWED_ORIGINS)

    if isinstance(value, (list, tuple, set)):
        candidates = [str(segment).strip() for segment in value if str(segment).strip()]
        return candidates or list(DEFAULT_ALLOWED_ORIGINS)

    return list(DEFAULT_ALLOWED_ORIGINS)


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    app_name: str = Field("Garmin Tracker API", description="Human-friendly service name")
    environment: str = Field("development", description="Runtime environment name")
    database_url: str = Field(
        "postgresql+psycopg2://postgres:postgres@db:5432/garmin_tracker",
        description="PostgreSQL connection string",
    )
    allowed_origins_raw: str | None = Field(
        default=None,
        validation_alias="ALLOWED_ORIGINS",
        description="Comma-separated list of allowed CORS origins",
    )
    allowed_origins_override: list[str] | None = Field(
        default=None, description="Explicit override for allowed origins"
    )

    @property
    def allowed_origins(self) -> list[str]:
        if self.allowed_origins_override is not None:
            return _normalize_origins(self.allowed_origins_override)

        return _normalize_origins(self.allowed_origins_raw)


@lru_cache
def get_settings() -> Settings:
    return Settings()

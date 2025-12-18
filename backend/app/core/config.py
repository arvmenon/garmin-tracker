from functools import lru_cache
from typing import List

from pydantic import Field, field_validator
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
    allowed_origins: List[str] = Field(
        default_factory=lambda: ["http://localhost:4010"],
        description="Comma-separated list of allowed CORS origins",
    )

    @field_validator("allowed_origins", mode="before")
    @classmethod
    def split_origins(cls, value: str | list[str]) -> list[str]:
        if isinstance(value, str):
            return [origin.strip() for origin in value.split(",") if origin.strip()]
        return value


@lru_cache
def get_settings() -> Settings:
    return Settings()

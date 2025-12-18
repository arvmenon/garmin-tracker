from functools import lru_cache
from typing import Any, List

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", case_sensitive=False, extra="ignore"
    )

    app_name: str = Field("Garmin Tracker API", description="Human-friendly service name")
    environment: str = Field("development", description="Runtime environment name")
    database_url: str = Field(
        "postgresql+psycopg2://postgres:postgres@db:5432/garmin_tracker",
        description="PostgreSQL connection string",
    )
    allowed_origins: List[str] = Field(
        default_factory=lambda: ["*"], description="CORS allowlist for browser clients"
    )

    @field_validator("allowed_origins", mode="before")
    @classmethod
    def parse_origins(cls, value: Any) -> List[str]:
        if value is None or value == "":
            return ["*"]
        if isinstance(value, str):
            candidates = [segment.strip() for segment in value.split(",") if segment.strip()]
            if not candidates:
                return ["*"]
            return candidates
        return value


@lru_cache
def get_settings() -> Settings:
    return Settings()

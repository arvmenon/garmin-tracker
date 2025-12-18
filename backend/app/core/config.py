from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


DEFAULT_ALLOWED_ORIGINS = ("http://localhost:4010",)


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
    allowed_origins_raw: str | None = Field(
        default=None,
        validation_alias="ALLOWED_ORIGINS",
        description="Comma-separated list of allowed CORS origins",
    )

    @property
    def allowed_origins(self) -> list[str]:
        if self.allowed_origins_raw is None:
            return list(DEFAULT_ALLOWED_ORIGINS)

        candidates = [segment.strip() for segment in self.allowed_origins_raw.split(",") if segment.strip()]
        return candidates or list(DEFAULT_ALLOWED_ORIGINS)


@lru_cache
def get_settings() -> Settings:
    return Settings()

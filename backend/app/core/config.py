from functools import lru_cache
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    app_name: str = Field("Garmin Tracker API", description="Human-friendly service name")
    environment: str = Field("development", description="Runtime environment name")
    database_url: str = Field(
        "postgresql+psycopg2://postgres:postgres@db:5432/garmin_tracker",
        description="PostgreSQL connection string",
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()

import json
from functools import lru_cache
from typing import Any, List

from pydantic import Field, FieldValidationInfo, field_validator
from pydantic_settings import (
    BaseSettings,
    EnvSettingsSource,
    PydanticBaseSettingsSource,
    SettingsConfigDict,
)

DEFAULT_ALLOWED_ORIGINS = ("http://localhost:4010", "http://127.0.0.1:4010")


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
        env_ignore_empty=True,
    )

    app_name: str = Field("Garmin Tracker API", description="Human-friendly service name")
    environment: str = Field("development", description="Runtime environment name")
    database_url: str = Field(
        "postgresql+psycopg2://garmin_app:garmin_app@localhost:5432/garmin_tracker",
        description="PostgreSQL connection string",
    )
    allowed_origins_override: list[str] | None = Field(
        default=None,
        description="Optional override for allowed CORS origins",
    )
    allowed_origins: List[str] = Field(
        default_factory=lambda: list(DEFAULT_ALLOWED_ORIGINS),
        description="Comma-separated list of allowed CORS origins",
    )

    @field_validator("allowed_origins", mode="before")
    @classmethod
    def split_origins(cls, value: Any, info: FieldValidationInfo) -> list[str]:
        if info.data.get("allowed_origins_override") is not None:
            return _normalize_origins(info.data["allowed_origins_override"])

        return _normalize_origins(value)

    @classmethod
    def settings_customise_sources(
        cls,
        settings_cls: type[BaseSettings],
        init_settings: PydanticBaseSettingsSource,
        env_settings: PydanticBaseSettingsSource,
        dotenv_settings: PydanticBaseSettingsSource,
        file_secret_settings: PydanticBaseSettingsSource,
    ) -> tuple[PydanticBaseSettingsSource, ...]:
        class LenientEnvSettingsSource(EnvSettingsSource):
            def decode_complex_value(self, field_name: str, field: Field, value: Any) -> Any:  # type: ignore[override]
                if isinstance(value, str):
                    cleaned = value.strip()
                    if not cleaned:
                        return cleaned

                    try:
                        return json.loads(cleaned)
                    except json.JSONDecodeError:
                        return cleaned

                return value

        return (
            init_settings,
            LenientEnvSettingsSource(cls),
            dotenv_settings,
            file_secret_settings,
        )


@lru_cache
def get_settings() -> Settings:
    return Settings()

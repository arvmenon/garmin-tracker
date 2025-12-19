from backend.app.core.config import Settings


def test_allowed_origins_default(monkeypatch):
    monkeypatch.delenv("ALLOWED_ORIGINS", raising=False)

    settings = Settings()

    assert settings.allowed_origins == [
        "http://localhost:4010",
        "http://127.0.0.1:4010",
    ]


def test_allowed_origins_parses_comma_separated(monkeypatch):
    monkeypatch.setenv("ALLOWED_ORIGINS", "http://example.com, http://localhost:3000")

    settings = Settings()

    assert settings.allowed_origins == ["http://example.com", "http://localhost:3000"]


def test_allowed_origins_falls_back_when_empty(monkeypatch):
    monkeypatch.setenv("ALLOWED_ORIGINS", " , ")

    settings = Settings()

    assert settings.allowed_origins == [
        "http://localhost:4010",
        "http://127.0.0.1:4010",
    ]


def test_allowed_origins_accepts_iterable(monkeypatch):
    monkeypatch.setenv("ALLOWED_ORIGINS", "http://example.com")

    settings = Settings(
        allowed_origins_override=["http://example.com", " ", "http://localhost:3000"]
    )

    assert settings.allowed_origins == ["http://example.com", "http://localhost:3000"]


def test_database_url_default(monkeypatch):
    monkeypatch.delenv("DATABASE_URL", raising=False)

    settings = Settings()

    assert settings.database_url == "postgresql+psycopg2://garmin_app:garmin_app@localhost:5432/garmin_tracker"


def test_debug_logging_parses_bool(monkeypatch):
    monkeypatch.setenv("DEBUG_LOGGING", "true")

    settings = Settings()

    assert settings.debug_logging is True

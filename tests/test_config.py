from backend.app.core.config import Settings


def test_allowed_origins_default(monkeypatch):
    monkeypatch.delenv("ALLOWED_ORIGINS", raising=False)

    settings = Settings()

    assert settings.allowed_origins == ["http://localhost:4010"]


def test_allowed_origins_parses_comma_separated(monkeypatch):
    monkeypatch.setenv("ALLOWED_ORIGINS", "http://example.com, http://localhost:3000")

    settings = Settings()

    assert settings.allowed_origins == ["http://example.com", "http://localhost:3000"]


def test_allowed_origins_falls_back_when_empty(monkeypatch):
    monkeypatch.setenv("ALLOWED_ORIGINS", " , ")

    settings = Settings()

    assert settings.allowed_origins == ["http://localhost:4010"]


def test_allowed_origins_accepts_iterable(monkeypatch):
    monkeypatch.setenv("ALLOWED_ORIGINS", "http://example.com")

    settings = Settings(
        allowed_origins_override=["http://example.com", " ", "http://localhost:3000"]
    )

    assert settings.allowed_origins == ["http://example.com", "http://localhost:3000"]

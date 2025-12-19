from backend.app.core.logging import redact_database_url


def test_redact_database_url_masks_password():
    url = "postgresql+psycopg2://garmin_app:secret@db:5432/garmin_tracker"

    redacted = redact_database_url(url)

    assert redacted == "postgresql+psycopg2://garmin_app:****@db:5432/garmin_tracker"


def test_redact_database_url_passes_through_without_password():
    url = "postgresql+psycopg2://garmin_app@db:5432/garmin_tracker"

    redacted = redact_database_url(url)

    assert redacted == url

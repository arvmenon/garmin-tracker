import logging
from typing import Iterable
from urllib.parse import urlparse

from .config import Settings


def redact_database_url(database_url: str) -> str:
    parsed = urlparse(database_url)
    if not parsed.scheme or not parsed.netloc:
        return database_url

    if "@" not in parsed.netloc or ":" not in parsed.netloc.split("@", 1)[0]:
        return database_url

    credentials, host = parsed.netloc.rsplit("@", 1)
    username, _ = credentials.split(":", 1)
    redacted_netloc = f"{username}:****@{host}"
    return parsed._replace(netloc=redacted_netloc).geturl()


def _format_allowed_origins(origins: Iterable[str]) -> str:
    return ", ".join(origin for origin in origins if origin)


def configure_logging(settings: Settings) -> None:
    level = logging.DEBUG if settings.debug_logging else logging.INFO
    logging.basicConfig(
        level=level,
        format="%(asctime)s %(levelname)s %(name)s %(message)s",
    )


def log_startup(settings: Settings) -> None:
    logger = logging.getLogger("garmin_tracker.startup")
    logger.info("Starting %s", settings.app_name)
    logger.info(
        "Runtime environment=%s debug_logging=%s",
        settings.environment,
        settings.debug_logging,
    )
    logger.info("Database URL=%s", redact_database_url(settings.database_url))
    logger.info("Allowed origins=%s", _format_allowed_origins(settings.allowed_origins))

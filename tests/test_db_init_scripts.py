import os
import subprocess
from pathlib import Path


SCRIPT_PATH = Path(__file__).resolve().parents[1] / "docker/db-init/00-bootstrap-db.sh"


def run_bootstrap_script(
    tmp_path,
    app_password=None,
    readonly_password=None,
    app_db_name=None,
    debug_logging=None,
    return_output=False,
    script_path=SCRIPT_PATH,
):
    capture_path = tmp_path / "captured.sql"
    stub_psql = tmp_path / "psql"

    stub_psql.write_text("""#!/bin/sh
echo "-- PSQL CALL --" >>"$PSQL_CAPTURE_PATH"
cat >>"$PSQL_CAPTURE_PATH"
""")
    stub_psql.chmod(0o755)

    env = os.environ.copy()
    env.update(
        {
            "PSQL_BIN": str(stub_psql),
            "PSQL_CAPTURE_PATH": str(capture_path),
            "POSTGRES_USER": "postgres",
            "POSTGRES_DB": "postgres",
        }
    )

    if app_password is not None:
        env["APP_DB_PASSWORD"] = app_password
    elif "APP_DB_PASSWORD" in env:
        env.pop("APP_DB_PASSWORD")

    if readonly_password is not None:
        env["READONLY_DB_PASSWORD"] = readonly_password
    elif "READONLY_DB_PASSWORD" in env:
        env.pop("READONLY_DB_PASSWORD")

    if app_db_name is not None:
        env["APP_DB_NAME"] = app_db_name
    elif "APP_DB_NAME" in env:
        env.pop("APP_DB_NAME")

    if debug_logging is not None:
        env["DEBUG_LOGGING"] = debug_logging
    elif "DEBUG_LOGGING" in env:
        env.pop("DEBUG_LOGGING")

    result = subprocess.run(
        ["sh", str(script_path)],
        check=True,
        env=env,
        capture_output=return_output,
        text=True,
    )

    sql = capture_path.read_text()
    if return_output:
        return sql, result.stdout, result.stderr
    return sql


def test_bootstrap_script_inlines_password_and_escapes_quotes(tmp_path):
    sql = run_bootstrap_script(tmp_path, app_password="s'neaky")

    assert "DO\n$$" in sql
    assert "app_password text := 's''neaky';" in sql
    assert ":app_db_password" not in sql


def test_bootstrap_script_defaults_to_expected_passwords(tmp_path):
    sql = run_bootstrap_script(tmp_path)

    assert "app_password text := 'garmin_app';" in sql
    assert "readonly_password text := 'garmin_readonly';" in sql


def test_bootstrap_script_sets_up_roles_and_privileges(tmp_path):
    sql = run_bootstrap_script(
        tmp_path,
        app_password="garmin_app",
        readonly_password="garmin_readonly",
        app_db_name="garmin_tracker",
    )

    assert "app_db text := 'garmin_tracker';" in sql
    assert "CREATE DATABASE %I OWNER %I" in sql
    assert "CREATE EXTENSION IF NOT EXISTS postgis;" in sql
    assert "CREATE ROLE %I LOGIN PASSWORD %L" in sql
    assert "GRANT CONNECT ON DATABASE" in sql
    assert "GRANT USAGE, CREATE ON SCHEMA public" in sql
    assert "GRANT SELECT ON ALL TABLES IN SCHEMA public" in sql
    assert "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO %I" in sql


def test_bootstrap_script_emits_debug_log_when_enabled(tmp_path):
    sql, stdout, _ = run_bootstrap_script(tmp_path, debug_logging="true", return_output=True)

    assert "[db-init]" in stdout


def test_entrypoint_executes_docker_entrypoint(tmp_path):
    entrypoint_path = Path(__file__).resolve().parents[1] / "docker/postgres-entrypoint.sh"
    stub_entrypoint = tmp_path / "docker-entrypoint.sh"
    capture_path = tmp_path / "entrypoint.log"

    stub_entrypoint.write_text(
        """#!/bin/sh
echo "entrypoint called" >>"$ENTRYPOINT_LOG"
"""
    )
    stub_entrypoint.chmod(0o755)

    env = os.environ.copy()
    env.update(
        {
            "DOCKER_ENTRYPOINT_BIN": str(stub_entrypoint),
            "ENTRYPOINT_LOG": str(capture_path),
        }
    )

    subprocess.run(["sh", str(entrypoint_path), "postgres"], check=True, env=env)

    output = capture_path.read_text()
    assert "entrypoint called" in output

import os
import subprocess
from pathlib import Path


SCRIPT_PATH = Path(__file__).resolve().parents[1] / "docker/db-init/00-bootstrap-db.sh"


def run_bootstrap_script(
    tmp_path,
    app_password=None,
    readonly_password=None,
    app_db_name=None,
    netdata_password=None,
    netdata_user=None,
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

    if netdata_password is not None:
        env["NETDATA_DB_PASSWORD"] = netdata_password
    elif "NETDATA_DB_PASSWORD" in env:
        env.pop("NETDATA_DB_PASSWORD")

    if netdata_user is not None:
        env["NETDATA_DB_USER"] = netdata_user
    elif "NETDATA_DB_USER" in env:
        env.pop("NETDATA_DB_USER")

    subprocess.run(["sh", str(SCRIPT_PATH)], check=True, env=env)

    return capture_path.read_text()


def test_bootstrap_script_inlines_password_and_escapes_quotes(tmp_path):
    sql = run_bootstrap_script(tmp_path, app_password="s'neaky")

    assert "app_password text := 's''neaky';" in sql
    assert ":app_db_password" not in sql


def test_bootstrap_script_defaults_to_expected_passwords(tmp_path):
    sql = run_bootstrap_script(tmp_path)

    assert "app_password text := 'garmin_app';" in sql
    assert "readonly_password text := 'garmin_readonly';" in sql
    assert "netdata_password text := 'netdata';" in sql


def test_bootstrap_script_sets_up_roles_and_privileges(tmp_path):
    sql = run_bootstrap_script(
        tmp_path,
        app_password="garmin_app",
        readonly_password="garmin_readonly",
        app_db_name="garmin_tracker",
        netdata_password="netdata",
    )

    assert "app_db text := 'garmin_tracker';" in sql
    assert "CREATE DATABASE %I OWNER %I" in sql
    assert "CREATE EXTENSION IF NOT EXISTS postgis;" in sql
    assert "CREATE ROLE %I LOGIN PASSWORD %L" in sql
    assert "GRANT CONNECT ON DATABASE" in sql
    assert "GRANT USAGE, CREATE ON SCHEMA public" in sql
    assert "GRANT SELECT ON ALL TABLES IN SCHEMA public" in sql
    assert "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO %I" in sql
    assert "GRANT pg_monitor TO %I" in sql


def test_bootstrap_script_allows_disabling_netdata_role(tmp_path):
    sql = run_bootstrap_script(tmp_path, netdata_user="")

    assert "netdata_user text := '';" in sql

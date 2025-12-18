import os
import subprocess
from pathlib import Path


SCRIPT_PATH = Path(__file__).resolve().parents[1] / "docker/db-init/01-create-netdata-user.sh"


def run_netdata_script(tmp_path, password=None):
    capture_path = tmp_path / "captured.sql"
    stub_psql = tmp_path / "psql"

    stub_psql.write_text("""#!/bin/sh
cat >"$PSQL_CAPTURE_PATH"
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

    if password is not None:
        env["NETDATA_DB_PASSWORD"] = password
    elif "NETDATA_DB_PASSWORD" in env:
        env.pop("NETDATA_DB_PASSWORD")

    subprocess.run(["sh", str(SCRIPT_PATH)], check=True, env=env)

    return capture_path.read_text()


def test_netdata_script_inlines_password_and_escapes_quotes(tmp_path):
    sql = run_netdata_script(tmp_path, "s'neaky")

    assert "target_password text := 's''neaky';" in sql
    assert ":netdata_password" not in sql


def test_netdata_script_defaults_to_expected_password(tmp_path):
    sql = run_netdata_script(tmp_path)

    assert "target_password text := 'netdata';" in sql


def test_netdata_script_grants_expected_privileges(tmp_path):
    sql = run_netdata_script(tmp_path, "netdata")

    assert "CREATE ROLE netdata LOGIN PASSWORD" in sql
    assert "GRANT CONNECT ON DATABASE" in sql
    assert "GRANT USAGE ON SCHEMA public" in sql
    assert "GRANT SELECT ON ALL TABLES IN SCHEMA public" in sql
    assert "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO netdata;" in sql

#!/bin/sh
set -eu

DOCKER_ENTRYPOINT_BIN=${DOCKER_ENTRYPOINT_BIN:-/usr/local/bin/docker-entrypoint.sh}
PG_ISREADY_BIN=${PG_ISREADY_BIN:-pg_isready}
PSQL_BIN=${PSQL_BIN:-psql}

POSTGRES_USER=${POSTGRES_USER:-postgres}
POSTGRES_DB=${POSTGRES_DB:-postgres}
APP_DB_NAME=${APP_DB_NAME:-garmin_tracker}
NETDATA_DB_USER=${NETDATA_DB_USER-netdata}
NETDATA_DB_PASSWORD=${NETDATA_DB_PASSWORD-netdata}

APP_DB_NAME_ESCAPED=$(printf "%s" "$APP_DB_NAME" | sed "s/'/''/g")
NETDATA_DB_USER_ESCAPED=$(printf "%s" "$NETDATA_DB_USER" | sed "s/'/''/g")
NETDATA_DB_PASSWORD_ESCAPED=$(printf "%s" "$NETDATA_DB_PASSWORD" | sed "s/'/''/g")

"$DOCKER_ENTRYPOINT_BIN" "$@" &
postgres_pid=$!

tries=30
until "$PG_ISREADY_BIN" -U "$POSTGRES_USER" -d "$POSTGRES_DB" >/dev/null 2>&1; do
    tries=$((tries - 1))
    if [ "$tries" -le 0 ]; then
        echo "[db-entrypoint] Postgres did not become ready in time" >&2
        kill "$postgres_pid" 2>/dev/null || true
        exit 1
    fi
    sleep 1
done

"$PSQL_BIN" -v ON_ERROR_STOP=1 \
    --username "$POSTGRES_USER" \
    --dbname "$POSTGRES_DB" <<SQL
DO
$$
DECLARE
    app_db text := '${APP_DB_NAME_ESCAPED}';
    netdata_user text := '${NETDATA_DB_USER_ESCAPED}';
    netdata_password text := '${NETDATA_DB_PASSWORD_ESCAPED}';
BEGIN
    IF netdata_user <> '' AND NOT EXISTS (
        SELECT FROM pg_catalog.pg_roles WHERE rolname = netdata_user
    ) THEN
        EXECUTE format('CREATE ROLE %I LOGIN PASSWORD %L', netdata_user, netdata_password);
        EXECUTE format('GRANT pg_monitor TO %I', netdata_user);
    END IF;

    IF netdata_user <> '' AND EXISTS (
        SELECT FROM pg_database WHERE datname = app_db
    ) THEN
        EXECUTE format('GRANT CONNECT ON DATABASE %I TO %I', app_db, netdata_user);
    END IF;
END
$$;
SQL

wait "$postgres_pid"

#!/usr/bin/env bash
set -euo pipefail

NETDATA_PASSWORD=${NETDATA_DB_PASSWORD:-netdata}

# Ensure a monitoring-friendly role exists to satisfy connections using the "netdata" user.
# Password is configurable via NETDATA_DB_PASSWORD and defaults to "netdata".
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<SQL
DO
$$
DECLARE
    target_password text := ${NETDATA_PASSWORD@Q};
BEGIN
    IF NOT EXISTS (
        SELECT FROM pg_catalog.pg_roles WHERE rolname = 'netdata'
    ) THEN
        EXECUTE format('CREATE ROLE netdata LOGIN PASSWORD %L', target_password);
        EXECUTE format('GRANT CONNECT ON DATABASE %I TO netdata', current_database());
        GRANT USAGE ON SCHEMA public TO netdata;
        GRANT SELECT ON ALL TABLES IN SCHEMA public TO netdata;
        ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO netdata;
    END IF;
END
$$;
SQL

#!/bin/sh
set -eu

NETDATA_PASSWORD=${NETDATA_DB_PASSWORD:-netdata}
PSQL_BIN=${PSQL_BIN:-psql}
NETDATA_PASSWORD_SQL=$(printf "%s" "$NETDATA_PASSWORD" | sed "s/'/''/g")

# Ensure a monitoring-friendly role exists to satisfy connections using the "netdata" user.
# Password is configurable via NETDATA_DB_PASSWORD and defaults to "netdata".
"${PSQL_BIN}" -v ON_ERROR_STOP=1 \
     --username "$POSTGRES_USER" \
     --dbname "$POSTGRES_DB" <<SQL
SELECT format('CREATE ROLE netdata LOGIN PASSWORD %L', '${NETDATA_PASSWORD_SQL}')
WHERE NOT EXISTS (
    SELECT 1 FROM pg_catalog.pg_roles WHERE rolname = 'netdata'
)
\gexec

SELECT format('GRANT CONNECT ON DATABASE %I TO netdata', current_database())
\gexec

GRANT USAGE ON SCHEMA public TO netdata;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO netdata;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO netdata;
SQL

#!/bin/sh
set -eu

DEBUG_LOGGING=${DEBUG_LOGGING:-false}

log_debug() {
    case "$DEBUG_LOGGING" in
        1|true|TRUE|yes|YES|on|ON)
            printf '%s\n' "$@"
            ;;
        *)
            ;;
    esac
}

PSQL_BIN=${PSQL_BIN:-psql}
APP_DB_NAME=${APP_DB_NAME:-garmin_tracker}
APP_DB_USER=${APP_DB_USER:-garmin_app}
APP_DB_PASSWORD=${APP_DB_PASSWORD:-garmin_app}
READONLY_DB_USER=${READONLY_DB_USER:-garmin_readonly}
READONLY_DB_PASSWORD=${READONLY_DB_PASSWORD:-garmin_readonly}
NETDATA_DB_USER=${NETDATA_DB_USER-netdata}
NETDATA_DB_PASSWORD=${NETDATA_DB_PASSWORD-netdata}
APP_DB_NAME_ESCAPED=$(printf "%s" "$APP_DB_NAME" | sed "s/'/''/g")
APP_DB_USER_ESCAPED=$(printf "%s" "$APP_DB_USER" | sed "s/'/''/g")
APP_DB_PASSWORD_ESCAPED=$(printf "%s" "$APP_DB_PASSWORD" | sed "s/'/''/g")
READONLY_DB_USER_ESCAPED=$(printf "%s" "$READONLY_DB_USER" | sed "s/'/''/g")
READONLY_DB_PASSWORD_ESCAPED=$(printf "%s" "$READONLY_DB_PASSWORD" | sed "s/'/''/g")
NETDATA_DB_USER_ESCAPED=$(printf "%s" "$NETDATA_DB_USER" | sed "s/'/''/g")
NETDATA_DB_PASSWORD_ESCAPED=$(printf "%s" "$NETDATA_DB_PASSWORD" | sed "s/'/''/g")

log_debug "[db-init] Bootstrapping database roles"
log_debug "[db-init] app_db=${APP_DB_NAME} app_user=${APP_DB_USER} readonly_user=${READONLY_DB_USER} netdata_user=${NETDATA_DB_USER}"
if [ -z "$NETDATA_DB_USER" ]; then
    log_debug "[db-init] netdata role creation disabled (NETDATA_DB_USER is empty)"
fi

"${PSQL_BIN}" -v ON_ERROR_STOP=1 \
     --username "$POSTGRES_USER" \
     --dbname "$POSTGRES_DB" <<SQL
DO
$$
DECLARE
    app_db text := '${APP_DB_NAME_ESCAPED}';
    app_user text := '${APP_DB_USER_ESCAPED}';
    app_password text := '${APP_DB_PASSWORD_ESCAPED}';
    readonly_user text := '${READONLY_DB_USER_ESCAPED}';
    readonly_password text := '${READONLY_DB_PASSWORD_ESCAPED}';
    netdata_user text := '${NETDATA_DB_USER_ESCAPED}';
    netdata_password text := '${NETDATA_DB_PASSWORD_ESCAPED}';
BEGIN
    IF NOT EXISTS (
        SELECT FROM pg_catalog.pg_roles WHERE rolname = app_user
    ) THEN
        EXECUTE format('CREATE ROLE %I LOGIN PASSWORD %L', app_user, app_password);
    END IF;

    IF NOT EXISTS (
        SELECT FROM pg_catalog.pg_roles WHERE rolname = readonly_user
    ) THEN
        EXECUTE format('CREATE ROLE %I LOGIN PASSWORD %L', readonly_user, readonly_password);
    END IF;

    IF netdata_user <> '' AND NOT EXISTS (
        SELECT FROM pg_catalog.pg_roles WHERE rolname = netdata_user
    ) THEN
        EXECUTE format('CREATE ROLE %I LOGIN PASSWORD %L', netdata_user, netdata_password);
        EXECUTE format('GRANT pg_monitor TO %I', netdata_user);
    END IF;

    IF NOT EXISTS (
        SELECT FROM pg_database WHERE datname = app_db
    ) THEN
        EXECUTE format('CREATE DATABASE %I OWNER %I', app_db, app_user);
    END IF;
END
$$;
SQL

"${PSQL_BIN}" -v ON_ERROR_STOP=1 \
     --username "$POSTGRES_USER" \
     --dbname "$APP_DB_NAME" <<SQL
CREATE EXTENSION IF NOT EXISTS postgis;

DO
$$
DECLARE
    app_db text := '${APP_DB_NAME_ESCAPED}';
    app_user text := '${APP_DB_USER_ESCAPED}';
    readonly_user text := '${READONLY_DB_USER_ESCAPED}';
    netdata_user text := '${NETDATA_DB_USER_ESCAPED}';
BEGIN
    EXECUTE format('GRANT CONNECT ON DATABASE %I TO %I', app_db, app_user);
    EXECUTE format('GRANT CONNECT ON DATABASE %I TO %I', app_db, readonly_user);
    EXECUTE format('GRANT USAGE, CREATE ON SCHEMA public TO %I', app_user);
    EXECUTE format('GRANT USAGE ON SCHEMA public TO %I', readonly_user);
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO %I', app_user);
    EXECUTE format('GRANT SELECT ON ALL TABLES IN SCHEMA public TO %I', readonly_user);
    EXECUTE format('GRANT USAGE, SELECT, UPDATE ON ALL SEQUENCES IN SCHEMA public TO %I', app_user);
    EXECUTE format('GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO %I', readonly_user);
    EXECUTE format('ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO %I', app_user);
    EXECUTE format('ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO %I', readonly_user);
    EXECUTE format('ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT, UPDATE ON SEQUENCES TO %I', app_user);
    EXECUTE format('ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO %I', readonly_user);

    IF netdata_user <> '' THEN
        EXECUTE format('GRANT CONNECT ON DATABASE %I TO %I', app_db, netdata_user);
    END IF;
END
$$;
SQL

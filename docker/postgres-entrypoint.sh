#!/bin/sh
set -eu

DOCKER_ENTRYPOINT_BIN=${DOCKER_ENTRYPOINT_BIN:-/usr/local/bin/docker-entrypoint.sh}

exec "$DOCKER_ENTRYPOINT_BIN" "$@"

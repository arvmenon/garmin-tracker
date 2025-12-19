#!/bin/sh
set -eu

cd /app/frontend

if [ ! -d node_modules ] || [ -z "$(ls -A node_modules)" ]; then
  npm install
fi

npm test

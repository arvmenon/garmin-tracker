#!/bin/sh
set -eu

VENV_PATH=${VENV_PATH:-/venv}

if [ ! -d "$VENV_PATH" ]; then
  python -m venv "$VENV_PATH"
fi

. "$VENV_PATH/bin/activate"
pip install -r backend/requirements.txt
pytest

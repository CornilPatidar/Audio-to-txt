#!/bin/bash
set -eo pipefail

echo "🚀 Starting Flask server..."
cd "$(dirname "$0")" || exit 1

echo "🧠 Pre-check: Whisper model load"
python3 - <<'PY' || exit 1
import whisper
print("Model exists:", hasattr(whisper, "load_model"))
PY

echo "✅ Whisper pre-check ok"

# serve
python3 transcribe_server.py
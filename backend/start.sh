#!/bin/bash
set -eo pipefail

echo "✅ Step 1: Entered start.sh"

cd "$(dirname "$0")" || exit 1
echo "✅ Step 2: Changed directory"

echo "✅ Step 3: Testing whisper model load"
python3 -c "import whisper; print('✅ whisper imported')" || echo "❌ Whisper failed to import"

echo "✅ Step 3.1: Ensuring ffmpeg is installed"
if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "ℹ️ Installing ffmpeg..."
  apt-get update && apt-get install -y ffmpeg || echo "⚠️ Failed to install ffmpeg; continuing"
else
  echo "✅ ffmpeg found"
fi

echo "✅ Step 4: Starting Flask"
export PORT="${PORT:-10000}"
python3 transcribe_server.py || echo "❌ transcribe_server.py crashed"
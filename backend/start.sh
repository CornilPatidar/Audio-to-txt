#!/bin/bash
set -eo pipefail

echo "✅ Step 1: Entered start.sh"

cd "$(dirname "$0")" || exit 1
echo "✅ Step 2: Changed directory"

echo "✅ Step 3: Testing whisper model load"
python3 -c "import whisper; print('✅ whisper imported')" || echo "❌ Whisper failed to import"

echo "✅ Step 4: Starting Flask"
python3 transcribe_server.py || echo "❌ transcribe_server.py crashed"
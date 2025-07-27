#!/bin/bash
set -eo pipefail  # 🔒 Exit if *any* command or pipe fails

echo "🚀 Starting Flask server..."
cd "$(dirname "$0")"

# Optional: health check before starting
python3 -c "import whisper; whisper.load_model('tiny')"
echo "✅ Whisper model loaded"

# Start server
python3 transcribe_server.py
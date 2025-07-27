from flask import Flask, request, jsonify
from flask_cors import CORS
import whisper
import os
from werkzeug.utils import secure_filename


# Init Flask
app = Flask(__name__)
app.config['PROPAGATE_EXCEPTIONS'] = True
CORS(app, resources={r"/*": {"origins": "*"}})

# Use model from env (default to 'base')
model_size = os.environ.get("WHISPER_MODEL", "tiny")  # use tiny for free tier
print(f"🧠 Loading Whisper model: {model_size}")
model = whisper.load_model(model_size)

# Upload folder
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/transcribe', methods=['POST'])
def transcribe():
    if 'audio' not in request.files:
        return jsonify({'error': 'No audio file provided'}), 400

    audio = request.files['audio']
    filename = secure_filename(audio.filename)
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    audio.save(filepath)

    try:
        print(f"📥 Received file: {filename}")
        result = model.transcribe(filepath)
        print("✅ Transcription completed.")
        return jsonify({'text': result['text']})
    except Exception as e:
        print("🔥 ERROR:", e)
        return jsonify({'error': str(e)}), 500
    finally:
        if os.path.exists(filepath):
            os.remove(filepath)
            print(f"🧹 Deleted temp file: {filename}")

@app.route('/transcribe', methods=['GET'])
def transcribe_get():
    return jsonify({'error': 'GET not supported. Use POST.'}), 405

@app.route('/')
def root():
    return "✅ AudioTextly is running."

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 10000))
    # print(f"🚀 Running on port {port}...")
    app.run(host='0.0.0.0', port=port)


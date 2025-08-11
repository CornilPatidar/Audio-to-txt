## 🎙️VoxScribe — Audio to Text

Convert audio files to text with a simple web UI and a Python (Flask) backend.

### 🌐Live Demo
- [audio-to-txt.vercel.app](https://audio-to-txt.vercel.app/)

## ✨Features
- Fast transcription via Python backend (Flask)
- Simple browser-based uploader and transcript viewer
- Works locally or via the hosted demo

## 🛠️Requirements
- Python 3.10+
- Windows PowerShell or Command Prompt

## 🚀Quick Start (Local)

### 1) 🖥️Backend (Flask)
Open a terminal and run:

```powershell
cd "C:\Users\patid\Audio-to-txt\backend"
py -m pip install -r requirements.txt
set PORT=10000
py transcribe_server.py
# Flask server starts on http://localhost:10000
```

### 2) 🌐Frontend (Static Site)
Open a new terminal and run:

```powershell
cd "C:\Users\patid\Audio-to-txt"
python -m http.server 5500
# Frontend available at http://localhost:5500
```

### 3) 🎉Use the App
Open `http://localhost:5500` in your browser, upload an audio file, and get the transcript.

Tip: After a reboot or terminal close, repeat steps 1 and 2.

## 📁Project Structure

```text
Audio-to-txt/
├─ backend/
│  ├─ requirements.txt
│  ├─ start.sh
│  ├─ transcribe_server.py
│  └─ uploads/
├─ index.html
├─ script.js
├─ style.css
└─ readme.md
```

— Live demo powered by the site at [audio-to-txt.vercel.app](https://audio-to-txt.vercel.app/).

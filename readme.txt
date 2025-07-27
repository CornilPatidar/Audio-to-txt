✅ Step 1: Start the Python Backend (Whisper + Flask)
Open Command Prompt

Run these commands:

cd "C:\Users\patid\Audio-to-txt\backend"
py transcribe_server.py
➡ This starts the Flask server on http://localhost:5000

✅ Step 2: Start the Frontend (Your Website)
Open a new Command Prompt

Run:

cd "C:\Users\patid\Audio-to-txt"
python -m http.server 5500
➡ This starts the frontend site on:
📂 http://localhost:5500

✅ Step 3: Open in Browser
Go to:

http://localhost:5500
📌 Upload an audio file → Get transcript!

🔁 Every time you restart PC or close terminals:
Repeat Step 1 and Step 2


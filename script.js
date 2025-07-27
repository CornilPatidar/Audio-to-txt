const fileInput = document.getElementById('audio-upload');
const audioPlayer = document.getElementById('audio-player');
const audioSource = document.getElementById('audio-source');
const transcriptionTextArea = document.querySelector("textarea");

fileInput.addEventListener('change', async () => {
  const file = fileInput.files[0];
  
  if (!file) {
    transcriptionTextArea.value = "⚠️ No file selected.";
    return;
  }

  const url = URL.createObjectURL(file);
  audioSource.src = url;
  audioPlayer.load();
  transcriptionTextArea.value = "⏳ Transcribing... Please wait...";

  const formData = new FormData();
  formData.append("audio", file);

  try {
        const API_URL = window.location.hostname.includes("localhost")
      ? "http://localhost:10000"
      : "https://audio-to-txt.vercel.app";

    const res = await fetch(`${API_URL}/transcribe`, {
      method: "POST",
      body: formData,
    });

    // 🔒 check response status before parsing
    if (!res.ok) {
      throw new Error(`Server returned ${res.status} (${res.statusText})`);
    }

    const data = await res.json();
    transcriptionTextArea.value = data.text || "❌ Transcription failed.";
  } catch (err) {
    transcriptionTextArea.value = "⚠️ Error: " + err.message;
  }
});
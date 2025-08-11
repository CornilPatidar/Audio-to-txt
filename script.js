const fileInput = document.getElementById('audio-upload');
const audioPlayer = document.getElementById('audio-player');
const audioSource = document.getElementById('audio-source');
const transcriptionTextArea = document.querySelector('textarea');

function getCandidateApiBases() {
  const isLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname);
  if (isLocal) {
    return [
      'http://localhost:10000',
      'http://127.0.0.1:10000',
      'http://localhost:5000',
      'http://127.0.0.1:5000'
    ];
  }
  return [
    'https://audio-to-txt.onrender.com'
  ];
}

async function postToFirstWorkingEndpoint(formData) {
  const errors = [];
  for (const base of getCandidateApiBases()) {
    const url = `${base}/transcribe`;
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 60000);
      const res = await fetch(url, {
        method: 'POST',
        body: formData,
        signal: controller.signal
      });
      clearTimeout(timeout);
      if (!res.ok) {
        errors.push(`${res.status} ${res.statusText} at ${url}`);
        continue;
      }
      return await res.json();
    } catch (e) {
      errors.push(`${e.name === 'AbortError' ? 'Timeout' : e.message} at ${url}`);
    }
  }
  const hint = window.location.hostname.includes('localhost')
    ? 'Ensure the backend is running on http://localhost:10000 or http://localhost:5000.'
    : 'Ensure the Render backend URL is correct and reachable.';
  throw new Error(`All endpoints failed. ${hint}\n\nTried:\n- ${errors.join('\n- ')}`);
}

fileInput.addEventListener('change', async () => {
  const file = fileInput.files[0];

  if (!file) {
    transcriptionTextArea.value = '⚠️ No file selected.';
    return;
  }

  const url = URL.createObjectURL(file);
  audioSource.src = url;
  audioPlayer.load();
  transcriptionTextArea.value = '⏳ Transcribing... Please wait...';

  const formData = new FormData();
  formData.append('audio', file);

  try {
    const data = await postToFirstWorkingEndpoint(formData);
    transcriptionTextArea.value = data.text || '❌ Transcription failed.';
  } catch (err) {
    transcriptionTextArea.value = `⚠️ Could not transcribe.\n\n${err.message}`;
    console.error('🧠 Transcription Error:', err);
  }
});
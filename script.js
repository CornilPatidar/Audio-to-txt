const fileInput = document.getElementById('audio-upload');
const audioPlayer = document.getElementById('audio-player');
const audioSource = document.getElementById('audio-source');
const transcriptionTextArea = document.querySelector('textarea');

function getCandidateApiBases() {
  const isLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname);
  // URL param override: ?api=https://your-service.onrender.com
  const apiParam = new URLSearchParams(window?.location?.search || '').get('api');
  if (apiParam?.trim?.()) {
    return [apiParam.trim().replace(/\/$/, '')];
  }
  const override = window?.API_BASE?.trim?.() ? window.API_BASE.trim().replace(/\/$/, '') : '';
  if (override) {
    return [override];
  }
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
      const isProd = !['localhost', '127.0.0.1'].includes(window.location.hostname);
      const timeoutMs = isProd ? 180000 : 60000; // 3 min in prod, 1 min locally
      const timeout = setTimeout(() => controller.abort(), timeoutMs);
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
  const failure = new Error('ENDPOINTS_FAILED');
  failure.name = 'EndpointsFailureError';
  failure.endpointErrors = errors;
  failure.isLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname);
  throw failure;
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
    if (err && err.name === 'EndpointsFailureError') {
      const isLocal = err.isLocal;
      transcriptionTextArea.value = isLocal
        ? 'Could not reach the transcription server. Please make sure the backend is running on your computer (http://localhost:10000), then try again.'
        : 'We could not reach the transcription server right now. This can happen when the free server is waking up or if the audio is too long. Please wait 30–60 seconds and try again, or try a shorter clip.';
      // Open the help details to guide users
      const help = document.getElementById('help-details');
      if (help) help.open = true;
    } else {
      transcriptionTextArea.value = 'Something went wrong while transcribing. Please try again.';
    }
    console.error('🧠 Transcription Error:', err);
  }
});

// Handle clicking on sample files to auto-transcribe
document.addEventListener('click', async (e) => {
  const target = e.target;
  if (!(target instanceof HTMLElement)) return;
  if (!target.classList.contains('sample-btn')) return;

  const sampleUrl = target.getAttribute('data-url');
  if (!sampleUrl) return;

  try {
    transcriptionTextArea.value = '⏳ Downloading sample and transcribing...';
    const response = await fetch(sampleUrl);
    if (!response.ok) {
      throw new Error(`Sample fetch failed: ${response.status} ${response.statusText}`);
    }
    const blob = await response.blob();
    const filename = sampleUrl.split('/').pop() || 'sample.mp3';
    const file = new File([blob], filename, { type: blob.type || 'audio/mpeg' });

    // Reflect in audio player
    const url = URL.createObjectURL(file);
    audioSource.src = url;
    audioPlayer.load();

    const formData = new FormData();
    formData.append('audio', file);

    const data = await postToFirstWorkingEndpoint(formData);
    transcriptionTextArea.value = data.text || '❌ Transcription failed.';
  } catch (err) {
    if (err && err.name === 'EndpointsFailureError') {
      const isLocal = err.isLocal;
      transcriptionTextArea.value = isLocal
        ? 'Could not reach the transcription server. Please start the backend locally (http://localhost:10000) and try again.'
        : 'We could not reach the transcription server right now. The free server may be waking up, or the audio is too long for the time limit. Please wait a minute and try again, or pick a shorter sample.';
      const help = document.getElementById('help-details');
      if (help) help.open = true;
    } else {
      transcriptionTextArea.value = 'Could not transcribe this sample. Please try again.';
    }
    console.error('🧠 Sample Transcription Error:', err);
  }
});
export function checkBrowserSupport(): { supported: boolean; reason?: string } {
  if (!navigator.mediaDevices?.getUserMedia) {
    return {
      supported: false,
      reason: 'Your browser does not support audio recording. Please use a modern browser.',
    };
  }

  if (!window.AudioContext && !window.webkitAudioContext) {
    return {
      supported: false,
      reason: 'Your browser does not support audio processing. Please use a modern browser.',
    };
  }

  return { supported: true };
}
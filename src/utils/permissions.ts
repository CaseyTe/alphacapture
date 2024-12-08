export async function requestMicrophonePermission(): Promise<boolean> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ 
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        sampleRate: 44100,
        channelCount: 1,
      }
    });
    
    // Clean up the test stream
    stream.getTracks().forEach(track => track.stop());
    return true;
  } catch (error: any) {
    if (error.name === 'NotAllowedError') {
      throw new Error('Microphone access was denied. Please enable microphone access in your browser settings.');
    } else if (error.name === 'NotFoundError') {
      throw new Error('No microphone was found. Please connect a microphone and try again.');
    } else if (error.name === 'NotReadableError') {
      throw new Error('Your microphone is busy or not responding. Please check your audio settings.');
    }
    throw new Error('Failed to access microphone. Please check your audio settings.');
  }
}
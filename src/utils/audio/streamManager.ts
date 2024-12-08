export class AudioStreamManager {
  private stream: MediaStream | null = null;
  private isActive: boolean = false;

  async initialize(): Promise<MediaStream> {
    try {
      if (this.stream) {
        this.stop();
      }

      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        },
        video: false
      });

      this.isActive = true;
      console.log('Audio stream initialized successfully');
      return this.stream;
    } catch (error) {
      console.error('Failed to get microphone stream:', error);
      throw new Error('Could not access microphone. Please ensure microphone permissions are granted.');
    }
  }

  getAudioTracks() {
    return this.stream?.getAudioTracks() || [];
  }

  isStreamActive() {
    return this.isActive && this.stream?.active;
  }

  stop() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => {
        track.stop();
        console.log('Stopped audio track:', track.label);
      });
      this.stream = null;
    }
    this.isActive = false;
  }
}
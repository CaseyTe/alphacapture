import { AppError, errorMessages } from './errors';
import { AudioQualityConfig, defaultAudioConfig, validateAudioQuality } from './audioQuality';

export class AudioStreamManager {
  private stream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private sourceNode: MediaStreamAudioSourceNode | null = null;
  private retryAttempts = 0;
  private readonly maxRetries = 3;

  async initialize(config: AudioQualityConfig = defaultAudioConfig): Promise<void> {
    try {
      if (this.stream) {
        return;
      }

      this.stream = await this.getAudioStream(config);
      
      if (!validateAudioQuality(this.stream)) {
        throw new AppError(
          'Audio stream does not meet quality requirements',
          'QUALITY_ERROR'
        );
      }

      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.sourceNode = this.audioContext.createMediaStreamSource(this.stream);
    } catch (error: any) {
      this.cleanup();
      throw new AppError(
        error.message || errorMessages.MICROPHONE_ERROR,
        'STREAM_INIT_ERROR',
        error
      );
    }
  }

  private async getAudioStream(config: AudioQualityConfig): Promise<MediaStream> {
    while (this.retryAttempts < this.maxRetries) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            ...config,
            deviceId: undefined // Let the browser choose the best device
          }
        });

        const audioTrack = stream.getAudioTracks()[0];
        if (!audioTrack || !audioTrack.enabled) {
          throw new Error('Audio track not available or disabled');
        }

        return stream;
      } catch (error: any) {
        this.retryAttempts++;
        if (this.retryAttempts >= this.maxRetries) {
          throw error;
        }
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1s before retry
      }
    }

    throw new Error('Failed to get audio stream after multiple attempts');
  }

  getStream(): MediaStream {
    if (!this.stream) {
      throw new AppError(
        'Audio stream not initialized',
        'NO_STREAM'
      );
    }
    return this.stream;
  }

  isStreamActive(): boolean {
    return Boolean(
      this.stream && 
      this.stream.active && 
      this.stream.getAudioTracks().some(track => track.enabled && track.readyState === 'live')
    );
  }

  cleanup(): void {
    if (this.sourceNode) {
      this.sourceNode.disconnect();
      this.sourceNode = null;
    }

    if (this.stream) {
      this.stream.getTracks().forEach(track => {
        track.stop();
        this.stream?.removeTrack(track);
      });
      this.stream = null;
    }

    if (this.audioContext?.state !== 'closed') {
      this.audioContext?.close().catch(console.error);
    }
    this.audioContext = null;
    this.retryAttempts = 0;
  }
}
import { AppError, errorMessages } from '../errors';
import { AudioQualityConfig, defaultAudioConfig, validateAudioQuality } from './audioQuality';

export class AudioStreamManager {
  private stream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private sourceNode: MediaStreamAudioSourceNode | null = null;

  async initialize(config: AudioQualityConfig = defaultAudioConfig): Promise<void> {
    try {
      if (this.stream) {
        return;
      }

      this.stream = await this.getAudioStream(config);
      validateAudioQuality(this.stream);

      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.sourceNode = this.audioContext.createMediaStreamSource(this.stream);
    } catch (error: any) {
      this.cleanup();
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        error.message || errorMessages.MICROPHONE_ERROR,
        'STREAM_INIT_ERROR',
        error
      );
    }
  }

  private async getAudioStream(config: AudioQualityConfig): Promise<MediaStream> {
    try {
      return await navigator.mediaDevices.getUserMedia({
        audio: {
          ...config,
          deviceId: undefined
        }
      });
    } catch (error: any) {
      if (error.name === 'NotAllowedError') {
        throw new AppError(errorMessages.MICROPHONE_ACCESS_DENIED, 'PERMISSION_DENIED');
      }
      if (error.name === 'NotFoundError') {
        throw new AppError(errorMessages.NO_MICROPHONE_FOUND, 'NO_DEVICE');
      }
      throw error;
    }
  }

  getStream(): MediaStream {
    if (!this.stream) {
      throw new AppError('Audio stream not initialized', 'NO_STREAM');
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
  }
}
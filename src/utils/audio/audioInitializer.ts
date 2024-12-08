import { AppError, errorMessages } from '../errors';
import { AudioQualityConfig, defaultAudioConfig } from './audioQuality';
import { checkBrowserSupport } from '../browser';

export class AudioInitializer {
  private retryAttempts = 0;
  private readonly maxRetries = 3;
  private readonly retryDelay = 1000;

  async initialize(config: AudioQualityConfig = defaultAudioConfig): Promise<MediaStream> {
    const browserSupport = checkBrowserSupport();
    if (!browserSupport.supported) {
      throw new AppError(browserSupport.reason || 'Browser not supported', 'BROWSER_NOT_SUPPORTED');
    }

    while (this.retryAttempts < this.maxRetries) {
      try {
        const stream = await this.requestAudioStream(config);
        const audioTrack = stream.getAudioTracks()[0];
        
        if (!audioTrack || !audioTrack.enabled) {
          throw new AppError(errorMessages.NO_MICROPHONE_FOUND, 'NO_AUDIO_TRACK');
        }

        if (audioTrack.readyState !== 'live') {
          throw new AppError(errorMessages.MICROPHONE_ERROR, 'TRACK_NOT_LIVE');
        }

        return stream;
      } catch (error: any) {
        this.retryAttempts++;
        
        if (error instanceof AppError) {
          throw error;
        }

        if (error.name === 'NotAllowedError') {
          throw new AppError(errorMessages.MICROPHONE_ACCESS_DENIED, 'PERMISSION_DENIED');
        }

        if (error.name === 'NotFoundError') {
          throw new AppError(errorMessages.NO_MICROPHONE_FOUND, 'NO_DEVICE');
        }

        if (this.retryAttempts >= this.maxRetries) {
          throw new AppError(errorMessages.MICROPHONE_ERROR, 'INIT_FAILED', error);
        }

        await new Promise(resolve => setTimeout(resolve, this.retryDelay));
      }
    }

    throw new AppError(errorMessages.MICROPHONE_ERROR, 'MAX_RETRIES_EXCEEDED');
  }

  private async requestAudioStream(config: AudioQualityConfig): Promise<MediaStream> {
    return navigator.mediaDevices.getUserMedia({
      audio: {
        ...config,
        deviceId: undefined
      }
    });
  }
}
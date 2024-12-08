import { AppError, errorMessages } from '../errors';
import { checkBrowserSupport } from '../browser';
import { Logger } from './logger';

export interface AudioConfig {
  echoCancellation: boolean;
  noiseSuppression: boolean;
  autoGainControl: boolean;
  sampleRate: number;
  channelCount: number;
}

const DEFAULT_CONFIG: AudioConfig = {
  echoCancellation: true,
  noiseSuppression: true,
  autoGainControl: true,
  sampleRate: 44100,
  channelCount: 1,
};

export class AudioInitializer {
  private retryAttempts = 0;
  private readonly maxRetries = 3;
  private readonly retryDelay = 1000;

  async initialize(config: AudioConfig = DEFAULT_CONFIG): Promise<MediaStream> {
    Logger.info('Initializing audio...');
    
    const browserSupport = checkBrowserSupport();
    if (!browserSupport.supported) {
      Logger.error(new Error(browserSupport.reason || 'Browser not supported'), 'browserCheck');
      throw new AppError(
        browserSupport.reason || 'Browser not supported',
        'BROWSER_NOT_SUPPORTED'
      );
    }

    while (this.retryAttempts < this.maxRetries) {
      try {
        Logger.debug(`Attempt ${this.retryAttempts + 1} to get audio stream`);
        const stream = await this.requestAudioStream(config);
        
        Logger.debug('Validating audio stream');
        await this.validateStream(stream);
        
        Logger.info('Audio initialized successfully');
        return stream;
      } catch (error: any) {
        this.retryAttempts++;
        Logger.error(error, `initializeAttempt${this.retryAttempts}`);
        
        if (error instanceof AppError) {
          throw error;
        }

        if (this.retryAttempts >= this.maxRetries) {
          throw new AppError(
            errorMessages.MICROPHONE_ERROR,
            'INIT_FAILED',
            error
          );
        }

        Logger.debug(`Retrying in ${this.retryDelay}ms...`);
        await new Promise(resolve => setTimeout(resolve, this.retryDelay));
      }
    }

    throw new AppError(errorMessages.MICROPHONE_ERROR, 'MAX_RETRIES_EXCEEDED');
  }

  private async requestAudioStream(config: AudioConfig): Promise<MediaStream> {
    try {
      Logger.debug('Requesting audio stream with config:', config);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          ...config,
          deviceId: undefined
        }
      });
      Logger.debug('Audio stream obtained');
      return stream;
    } catch (error: any) {
      Logger.error(error, 'requestAudioStream');
      
      if (error.name === 'NotAllowedError') {
        throw new AppError(
          errorMessages.MICROPHONE_ACCESS_DENIED,
          'PERMISSION_DENIED'
        );
      }
      if (error.name === 'NotFoundError') {
        throw new AppError(
          errorMessages.NO_MICROPHONE_FOUND,
          'NO_DEVICE'
        );
      }
      throw error;
    }
  }

  private async validateStream(stream: MediaStream): Promise<void> {
    const audioTrack = stream.getAudioTracks()[0];
    
    if (!audioTrack || !audioTrack.enabled) {
      Logger.error(new Error('No audio track or track disabled'), 'validateStream');
      throw new AppError(
        errorMessages.NO_MICROPHONE_FOUND,
        'NO_AUDIO_TRACK'
      );
    }

    if (audioTrack.readyState !== 'live') {
      Logger.error(new Error(`Invalid track state: ${audioTrack.readyState}`), 'validateStream');
      throw new AppError(
        errorMessages.MICROPHONE_ERROR,
        'TRACK_NOT_LIVE'
      );
    }

    Logger.debug('Audio stream validation passed');
  }
}
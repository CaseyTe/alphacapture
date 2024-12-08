import { AppError, errorMessages } from '../errors';
import { AudioInitializer } from './AudioInitializer';
import { TranscriptionManager } from './TranscriptionManager';
import { validateAudioState } from './audioValidation';
import { Logger } from './logger';

export class RecordingManager {
  private isRecording = false;
  private audioInitializer: AudioInitializer;
  private transcriptionManager: TranscriptionManager;
  private currentStream: MediaStream | null = null;

  constructor(onTranscript: (text: string) => void) {
    Logger.info('Initializing RecordingManager');
    this.audioInitializer = new AudioInitializer();
    this.transcriptionManager = new TranscriptionManager(onTranscript);
  }

  async startRecording(): Promise<void> {
    Logger.info('Starting recording...');
    
    if (this.isRecording) {
      Logger.warn('Recording already in progress');
      throw new AppError(errorMessages.RECORDING_IN_PROGRESS, 'ALREADY_RECORDING');
    }

    try {
      // Initialize audio stream first
      Logger.debug('Initializing audio stream');
      this.currentStream = await this.audioInitializer.initialize();
      
      if (!this.currentStream) {
        throw new AppError('Failed to initialize audio stream', 'STREAM_INIT_FAILED');
      }

      // Validate the stream
      Logger.debug('Validating audio state');
      validateAudioState(false, this.currentStream);

      // Start transcription only after stream is validated
      Logger.debug('Starting transcription');
      await this.transcriptionManager.start(this.currentStream);
      
      this.isRecording = true;
      Logger.info('Recording started successfully');
    } catch (error) {
      Logger.error(error as Error, 'startRecording');
      this.cleanup();
      
      if (error instanceof AppError) {
        throw error;
      }
      
      throw new AppError(
        'Failed to start recording',
        'RECORDING_ERROR',
        error
      );
    }
  }

  async stopRecording(): Promise<void> {
    Logger.info('Stopping recording...');
    
    if (!this.isRecording) {
      Logger.debug('No active recording to stop');
      return;
    }

    try {
      await this.transcriptionManager.stop();
      Logger.info('Recording stopped successfully');
    } catch (error) {
      Logger.error(error as Error, 'stopRecording');
      throw error;
    } finally {
      this.cleanup();
    }
  }

  async pauseRecording(): Promise<void> {
    Logger.info('Pausing recording...');
    
    if (!this.isRecording) {
      Logger.warn('No active recording to pause');
      throw new AppError(errorMessages.RECORDING_NOT_STARTED, 'NOT_RECORDING');
    }

    try {
      await this.transcriptionManager.pause();
      this.isRecording = false;
      Logger.info('Recording paused successfully');
    } catch (error) {
      Logger.error(error as Error, 'pauseRecording');
      this.cleanup();
      throw error;
    }
  }

  async resumeRecording(): Promise<void> {
    Logger.info('Resuming recording...');
    
    if (this.isRecording) {
      Logger.warn('Recording already in progress');
      throw new AppError(errorMessages.RECORDING_IN_PROGRESS, 'ALREADY_RECORDING');
    }

    try {
      // Get a fresh stream when resuming
      Logger.debug('Reinitializing audio stream');
      this.currentStream = await this.audioInitializer.initialize();
      
      if (!this.currentStream) {
        throw new AppError('Failed to initialize audio stream', 'STREAM_INIT_FAILED');
      }

      Logger.debug('Validating audio state');
      validateAudioState(false, this.currentStream);
      
      Logger.debug('Resuming transcription');
      await this.transcriptionManager.resume(this.currentStream);
      
      this.isRecording = true;
      Logger.info('Recording resumed successfully');
    } catch (error) {
      Logger.error(error as Error, 'resumeRecording');
      this.cleanup();
      throw error;
    }
  }

  cleanup(): void {
    Logger.debug('Cleaning up recording resources');
    this.isRecording = false;
    
    if (this.currentStream) {
      this.currentStream.getTracks().forEach(track => {
        track.stop();
        Logger.debug(`Stopped audio track: ${track.label}`);
      });
      this.currentStream = null;
    }
    
    this.transcriptionManager.cleanup();
    Logger.debug('Cleanup completed');
  }
}
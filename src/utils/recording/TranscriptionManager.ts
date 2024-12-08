import MicrophoneStream from 'microphone-stream';
import { StartStreamTranscriptionCommand } from '@aws-sdk/client-transcribe-streaming';
import { AppError, errorMessages } from '../errors';
import { transcribeClient } from '../../config/aws';
import { Logger } from './logger';

export class TranscriptionManager {
  private micStream: any | null = null;
  private transcriptionStream: AsyncGenerator<any, void, unknown> | null = null;
  private isTranscribing = false;

  constructor(private onTranscript: (text: string) => void) {
    if (!import.meta.env.VITE_AWS_ACCESS_KEY_ID || !import.meta.env.VITE_AWS_SECRET_ACCESS_KEY) {
      throw new AppError(
        errorMessages.AWS_CREDENTIALS_MISSING,
        'AWS_CREDENTIALS_MISSING'
      );
    }
  }

  async start(stream: MediaStream): Promise<void> {
    Logger.info('Starting transcription...');
    
    if (this.isTranscribing) {
      Logger.warn('Transcription already in progress');
      return;
    }

    try {
      this.micStream = new MicrophoneStream();
      this.micStream.setStream(stream);
      this.isTranscribing = true;
      await this.startTranscription();
    } catch (error) {
      Logger.error(error as Error, 'start');
      this.cleanup();
      throw error;
    }
  }

  async pause(): Promise<void> {
    Logger.info('Pausing transcription...');
    this.cleanup();
  }

  async resume(stream: MediaStream): Promise<void> {
    Logger.info('Resuming transcription...');
    await this.start(stream);
  }

  async stop(): Promise<void> {
    Logger.info('Stopping transcription...');
    this.cleanup();
  }

  private async startTranscription(): Promise<void> {
    if (!this.micStream) {
      throw new AppError('No microphone stream available', 'NO_MIC_STREAM');
    }

    const audioStream = async function* () {
      try {
        for await (const chunk of this.micStream) {
          if (!this.isTranscribing) break;
          yield { AudioEvent: { AudioChunk: chunk } };
        }
      } catch (error) {
        Logger.error(error as Error, 'audioStream');
        throw error;
      }
    }.bind(this);

    const command = new StartStreamTranscriptionCommand({
      LanguageCode: 'en-US',
      MediaEncoding: 'pcm',
      MediaSampleRateHertz: 44100,
      AudioStream: audioStream(),
    });

    try {
      Logger.debug('Starting AWS Transcribe stream...');
      const response = await transcribeClient.send(command);
      
      if (!response.TranscriptResultStream) {
        throw new AppError('No transcript stream received', 'NO_TRANSCRIPT_STREAM');
      }

      this.transcriptionStream = response.TranscriptResultStream;
      
      for await (const event of this.transcriptionStream) {
        if (!this.isTranscribing) break;
        
        const results = event.TranscriptEvent?.Transcript?.Results;
        if (results?.[0]?.IsPartial === false) {
          const text = results[0].Alternatives?.[0].Transcript;
          if (text) {
            this.onTranscript(text.trim());
          }
        }
      }
    } catch (error) {
      Logger.error(error as Error, 'startTranscription');
      throw new AppError(
        errorMessages.TRANSCRIPTION_FAILED,
        'TRANSCRIPTION_ERROR',
        error
      );
    }
  }

  cleanup(): void {
    Logger.debug('Cleaning up transcription resources...');
    this.isTranscribing = false;

    if (this.micStream) {
      try {
        this.micStream.stop();
        this.micStream = null;
        Logger.debug('Microphone stream stopped');
      } catch (error) {
        Logger.error(error as Error, 'cleanup');
      }
    }

    this.transcriptionStream = null;
    Logger.debug('Cleanup completed');
  }
}
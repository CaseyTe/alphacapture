import MicrophoneStream from 'microphone-stream';
import { StartStreamTranscriptionCommand } from '@aws-sdk/client-transcribe-streaming';
import { AppError, errorMessages } from './errors';
import { transcribeClient } from '../config/aws';
import { validateAudioState } from './audioValidation';
import { AudioInitializer } from './audio/audioInitializer';

export class AudioRecorder {
  private micStream: any | null = null;
  private isRecording = false;
  private transcriptionStream: AsyncGenerator<any, void, unknown> | null = null;
  private audioInitializer: AudioInitializer;

  constructor(private onTranscript: (text: string) => void) {
    if (!import.meta.env.VITE_AWS_ACCESS_KEY_ID || !import.meta.env.VITE_AWS_SECRET_ACCESS_KEY) {
      throw new AppError(errorMessages.AWS_CREDENTIALS_MISSING, 'AWS_CREDENTIALS_MISSING');
    }
    this.audioInitializer = new AudioInitializer();
  }

  async startRecording() {
    if (this.isRecording) {
      return;
    }

    try {
      const stream = await this.audioInitializer.initialize();
      validateAudioState(this.isRecording, stream);

      this.micStream = new MicrophoneStream();
      this.micStream.setStream(stream);
      this.isRecording = true;

      await this.startTranscription();
    } catch (error: any) {
      this.cleanup();
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        error.message || errorMessages.RECORDING_ERROR,
        'RECORDING_ERROR',
        error
      );
    }
  }

  private async startTranscription() {
    const audioStream = async function* () {
      for await (const chunk of this.micStream) {
        if (this.isRecording) {
          yield { AudioEvent: { AudioChunk: chunk } };
        } else {
          break;
        }
      }
    }.bind(this);

    const command = new StartStreamTranscriptionCommand({
      LanguageCode: 'en-US',
      MediaEncoding: 'pcm',
      MediaSampleRateHertz: 44100,
      AudioStream: audioStream(),
    });

    try {
      const response = await transcribeClient.send(command);
      this.transcriptionStream = response.TranscriptResultStream!;
      
      for await (const event of this.transcriptionStream) {
        if (!this.isRecording) break;
        
        const results = event.TranscriptEvent?.Transcript?.Results;
        if (results && results.length > 0) {
          const result = results[0];
          if (result.IsPartial === false) {
            const text = result.Alternatives?.[0].Transcript;
            if (text) {
              this.onTranscript(text.trim());
            }
          }
        }
      }
    } catch (error) {
      throw new AppError(errorMessages.TRANSCRIPTION_FAILED, 'TRANSCRIPTION_ERROR', error);
    }
  }

  private cleanup() {
    if (this.micStream) {
      try {
        this.micStream.stop();
      } catch (error) {
        console.error('Error stopping microphone stream:', error);
      }
      this.micStream = null;
    }

    this.transcriptionStream = null;
    this.isRecording = false;
  }

  async stopRecording() {
    if (!this.isRecording) {
      return;
    }

    this.cleanup();
  }

  async pauseRecording() {
    if (!this.isRecording) {
      throw new AppError(errorMessages.RECORDING_NOT_STARTED, 'NOT_RECORDING');
    }

    await this.stopRecording();
  }

  async resumeRecording() {
    await this.startRecording();
  }
}
import { 
  TranscribeStreamingClient,
  StartStreamTranscriptionCommand,
  TranscriptEvent,
  BadRequestException
} from '@aws-sdk/client-transcribe-streaming';
import { useMeetingStore } from '../store/useMeetingStore';
import { createTranscribeClient, createTranscriptionConfig } from './awsConfig';
import { AudioProcessor } from './audioProcessor';
import { audioWorkletCode } from './audioWorklet';

class TranscriptionManager {
  private client: TranscribeStreamingClient | null = null;
  private currentStream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private isTranscribing: boolean = false;
  private workletNode: AudioWorkletNode | null = null;
  private audioProcessor: AudioProcessor | null = null;
  private audioBuffer: Float32Array[] = [];
  private debugInterval: number | null = null;
  private lastProcessedTime: number = 0;
  private readonly CHUNK_INTERVAL = 100; // Process chunks every 100ms

  private async setupAudioWorklet() {
    if (!this.audioContext) return;

    const blob = new Blob([audioWorkletCode], { type: 'application/javascript' });
    const workletUrl = URL.createObjectURL(blob);

    try {
      await this.audioContext.audioWorklet.addModule(workletUrl);
      this.workletNode = new AudioWorkletNode(this.audioContext, 'audio-processor');
      
      this.workletNode.port.onmessage = (event) => {
        if (this.isTranscribing) {
          const audioData = new Float32Array(event.data);
          if (this.audioBuffer.length < 1000) { // Prevent buffer from growing too large
            this.audioBuffer.push(audioData);
          }
        }
      };

      console.log('Audio worklet setup completed');
    } catch (error) {
      console.error('Failed to setup audio worklet:', error);
      throw error;
    } finally {
      URL.revokeObjectURL(workletUrl);
    }
  }

  private async setupAWSClient() {
    try {
      if (!this.client) {
        console.log('Creating new AWS Transcribe client...');
        this.client = createTranscribeClient();
        console.log('AWS Transcribe client created successfully');
      }
      return this.client;
    } catch (error) {
      console.error('Failed to setup AWS client:', error);
      throw new Error('AWS configuration error');
    }
  }

  private createAudioStream = async function* (this: TranscriptionManager) {
    console.log('Starting audio stream generator...');
    let chunkCount = 0;
    
    while (this.isTranscribing) {
      const currentTime = Date.now();
      if (currentTime - this.lastProcessedTime >= this.CHUNK_INTERVAL && this.audioBuffer.length > 0) {
        const chunks = this.audioBuffer.splice(0, Math.min(10, this.audioBuffer.length));
        const combinedChunk = new Float32Array(chunks.reduce((acc, chunk) => acc + chunk.length, 0));
        
        let offset = 0;
        for (const chunk of chunks) {
          combinedChunk.set(chunk, offset);
          offset += chunk.length;
        }

        const processedChunk = this.audioProcessor!.processAudioChunk(combinedChunk);
        
        chunkCount++;
        if (chunkCount % 10 === 0) {
          console.log(`Processed ${chunkCount} audio chunks, buffer size: ${this.audioBuffer.length}`);
        }

        this.lastProcessedTime = currentTime;

        yield {
          AudioEvent: {
            AudioChunk: processedChunk
          }
        };
      }
      await new Promise(resolve => setTimeout(resolve, 20));
    }
    console.log('Audio stream generator ended');
  }

  async startTranscription(stream: MediaStream): Promise<void> {
    try {
      console.log('Starting transcription process...');
      this.stopTranscription();
      
      if (!stream) {
        throw new Error('No audio stream provided');
      }

      const audioTracks = stream.getAudioTracks();
      console.log('Audio tracks:', audioTracks.length);
      if (audioTracks.length === 0) {
        throw new Error('No audio track found in stream');
      }

      this.currentStream = stream;
      this.isTranscribing = true;
      this.audioBuffer = [];
      this.lastProcessedTime = Date.now();
      this.audioProcessor = new AudioProcessor();

      this.audioContext = new (window.AudioContext || window.webkitAudioContext)({
        sampleRate: 16000,
        latencyHint: 'interactive'
      });
      
      await this.setupAudioWorklet();
      const client = await this.setupAWSClient();
      const store = useMeetingStore.getState();

      const source = this.audioContext.createMediaStreamSource(stream);
      if (this.workletNode) {
        source.connect(this.workletNode);
      }

      this.debugInterval = window.setInterval(() => {
        console.log('Transcription status:', {
          isTranscribing: this.isTranscribing,
          bufferSize: this.audioBuffer.length,
          audioContextState: this.audioContext?.state,
          hasStream: !!this.currentStream,
          streamActive: this.currentStream?.active
        });
      }, 5000);

      await this.startTranscriptionStream(client, store);

    } catch (error) {
      console.error('Transcription error:', error);
      
      let errorMessage = 'Failed to start transcription';
      if (error instanceof BadRequestException) {
        errorMessage = 'Invalid audio format or configuration';
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      this.stopTranscription();
      throw new Error(errorMessage);
    }
  }

  private async startTranscriptionStream(client: TranscribeStreamingClient, store: any) {
    try {
      console.log('Creating transcription command...');
      const command = new StartStreamTranscriptionCommand(
        createTranscriptionConfig(this.createAudioStream())
      );

      console.log('Sending command to AWS Transcribe...');
      const response = await client.send(command);

      if (!response.TranscriptResultStream) {
        throw new Error('No transcript stream received from AWS');
      }

      console.log('Processing transcript stream...');
      for await (const event of response.TranscriptResultStream) {
        if (!this.isTranscribing) break;
        
        if ((event as TranscriptEvent).Transcript?.Results?.[0]) {
          const result = (event as TranscriptEvent).Transcript.Results[0];
          const transcription = result.Alternatives?.[0]?.Transcript;
          
          if (transcription) {
            console.log('Received transcription:', transcription);
            if (!result.IsPartial) {
              store.appendTranscript(transcription + ' ');
            }
          }
        }
      }
    } catch (error) {
      console.error('Transcription stream error:', error);
      throw error;
    }
  }

  stopTranscription(): void {
    console.log('Stopping transcription...');
    this.isTranscribing = false;
    
    if (this.debugInterval) {
      window.clearInterval(this.debugInterval);
      this.debugInterval = null;
    }

    if (this.currentStream) {
      this.currentStream.getTracks().forEach(track => {
        console.log('Stopping track:', track.kind, track.label);
        track.stop();
      });
      this.currentStream = null;
    }

    if (this.workletNode) {
      this.workletNode.disconnect();
      this.workletNode = null;
    }

    if (this.audioContext) {
      this.audioContext.close().catch(error => {
        console.error('Error closing audio context:', error);
      });
      this.audioContext = null;
    }

    if (this.client) {
      this.client.destroy();
      this.client = null;
    }

    this.audioBuffer = [];
    this.audioProcessor = null;
    console.log('Transcription cleanup completed');
  }
}

export const transcriptionManager = new TranscriptionManager();
import { 
  TranscribeStreamingClient,
  StartStreamTranscriptionCommand,
  TranscriptEvent
} from '@aws-sdk/client-transcribe-streaming';

export class TranscribeClient {
  private client: TranscribeStreamingClient | null = null;

  async initialize(region: string, credentials: { accessKeyId: string; secretAccessKey: string }) {
    this.client = new TranscribeStreamingClient({
      region,
      credentials,
      maxAttempts: 3
    });
    return this.client;
  }

  async startTranscription(command: StartStreamTranscriptionCommand) {
    if (!this.client) {
      throw new Error('TranscribeClient not initialized');
    }
    return this.client.send(command);
  }

  async *processTranscriptStream(stream: AsyncIterable<TranscriptEvent>) {
    for await (const event of stream) {
      if (event.Transcript?.Results?.[0]) {
        const result = event.Transcript.Results[0];
        const transcription = result.Alternatives?.[0]?.Transcript;
        
        if (transcription) {
          yield {
            text: transcription,
            isPartial: result.IsPartial || false
          };
        }
      }
    }
  }

  destroy() {
    if (this.client) {
      this.client.destroy();
      this.client = null;
    }
  }
}
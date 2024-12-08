import { 
  TranscribeStreamingClient,
  StartStreamTranscriptionCommand,
  TranscriptEvent
} from '@aws-sdk/client-transcribe-streaming';

export class TranscribeClient {
  private client: TranscribeStreamingClient | null = null;

  async initialize(region: string, credentials: { accessKeyId: string; secretAccessKey: string }) {
    console.log('Initializing AWS Transcribe client with region:', region);
    console.log('AWS credentials present:', {
      hasAccessKey: !!credentials.accessKeyId,
      hasSecretKey: !!credentials.secretAccessKey
    });
    
    this.client = new TranscribeStreamingClient({
      region,
      credentials,
      maxAttempts: 3
    });

    try {
      // Test the client configuration
      const clientConfig = await this.client.config.credentials();
      console.log('AWS client credentials loaded successfully');
      return this.client;
    } catch (error) {
      console.error('Error initializing AWS client:', error);
      throw error;
    }
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
import { TranscribeClient } from "../aws/transcribeClient";
import { AudioContextManager } from "../audio/audioContext";
import { AudioStreamManager } from "../audio/streamManager";
import { AudioProcessor } from "../audio/audioProcessor";
import { createTranscriptionCommand } from "../aws/awsConfig";
import { useMeetingStore } from "../../store/useMeetingStore";
import { audioWorkletCode } from "../audio/audioWorklet";

class TranscriptionService {
  private transcribeClient: TranscribeClient;
  private audioContext: AudioContextManager;
  private streamManager: AudioStreamManager;
  private audioProcessor: AudioProcessor;
  private isTranscribing: boolean = false;
  private audioBuffer: Float32Array[] = [];
  private debugInterval: number | null = null;
  private readonly CHUNK_SIZE = 2048;
  private readonly MAX_BUFFER_SIZE = 50;
  private isPaused: boolean = false;
  private transcribeController: AbortController | null = null;

  constructor() {
    this.transcribeClient = new TranscribeClient();
    this.audioContext = new AudioContextManager();
    this.streamManager = new AudioStreamManager();
    this.audioProcessor = new AudioProcessor();
  }

  async startTranscription(): Promise<void> {
    try {
      console.log("Starting transcription process...");
      const stream = await this.streamManager.initialize();
      const audioTracks = this.streamManager.getAudioTracks();

      if (audioTracks.length === 0) {
        throw new Error("No audio track found in stream");
      }

      this.isTranscribing = true;
      this.audioBuffer = [];
      this.isPaused = false;
      this.transcribeController = new AbortController();

      const workletBlob = new Blob([audioWorkletCode], {
        type: "application/javascript",
      });
      const workletUrl = URL.createObjectURL(workletBlob);

      try {
        const workletNode = await this.audioContext.initialize(
          stream,
          workletUrl
        );

        workletNode.port.onmessage = (event) => {
          if (this.isTranscribing && event.data) {
            const audioData = new Float32Array(event.data);
            if (this.audioBuffer.length < this.MAX_BUFFER_SIZE) {
              this.audioBuffer.push(audioData);
            }
          }
        };

        await this.transcribeClient.initialize(
          import.meta.env.VITE_AWS_REGION,
          {
            accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
            secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
          }
        );

        const command = createTranscriptionCommand(this.createAudioStream());
        const response = await this.transcribeClient.startTranscription(
          command
        );

        if (!response.TranscriptResultStream) {
          throw new Error("No transcript stream received from AWS");
        }

        this.startDebugInterval();

        try {
          for await (const event of response.TranscriptResultStream) {
            if (!this.isTranscribing) break;

            if (event.TranscriptEvent?.Transcript?.Results?.[0]) {
              const result = event.TranscriptEvent.Transcript.Results[0];
              if (result.Alternatives?.[0]?.Transcript) {
                const transcription = result.Alternatives[0].Transcript;
                if (!result.IsPartial) {
                  useMeetingStore
                    .getState()
                    .appendTranscript(transcription + " ");
                } else {
                }
              }
            }
          }
        } catch (error) {
          if (error instanceof Error) {
          }
          throw error;
        }
      } finally {
        URL.revokeObjectURL(workletUrl);
      }
    } catch (error) {
      this.stopTranscription();
      throw error;
    }
  }

  private async *createAudioStream() {
    const minChunksToProcess = 5; // Process at least 5 chunks at once

    while (this.isTranscribing) {
      if (this.audioBuffer.length >= minChunksToProcess) {
        // Process multiple chunks at once for efficiency
        const chunks = this.audioBuffer.splice(0, this.audioBuffer.length);
        const totalLength = chunks.reduce(
          (acc, chunk) => acc + chunk.length,
          0
        );
        const combinedChunk = new Float32Array(totalLength);

        let offset = 0;
        for (const chunk of chunks) {
          combinedChunk.set(chunk, offset);
          offset += chunk.length;
        }

        // Process the combined chunk
        const processedChunk =
          this.audioProcessor.processAudioChunk(combinedChunk);

        yield {
          AudioEvent: {
            AudioChunk: processedChunk,
          },
        };
      }

      // Smaller delay to be more responsive
      await new Promise((resolve) => setTimeout(resolve, 10));
    }
  }

  private startDebugInterval() {
    if (this.debugInterval) {
      clearInterval(this.debugInterval);
    }

    this.debugInterval = window.setInterval(() => {
      console.log("Transcription status:", {
        isTranscribing: this.isTranscribing,
        bufferSize: this.audioBuffer.length,
        audioContextState: this.audioContext.getState(),
        streamActive: this.streamManager.isStreamActive(),
      });
    }, 5000);
  }

  stopTranscription(): void {
    this.isTranscribing = false;
    this.isPaused = false;

    if (this.debugInterval) {
      window.clearInterval(this.debugInterval);
      this.debugInterval = null;
    }

    if (this.transcribeController) {
      this.transcribeController.abort();
      this.transcribeController = null;
    }

    this.streamManager.stop();
    this.audioContext.close();
    this.transcribeClient.destroy();
    this.audioBuffer = [];
  }
}

export const transcriptionService = new TranscriptionService();

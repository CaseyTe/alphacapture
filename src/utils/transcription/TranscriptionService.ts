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
            console.log("Received audio data chunk:", audioData.length);
            if (this.audioBuffer.length < this.MAX_BUFFER_SIZE) {
              this.audioBuffer.push(audioData);
              console.log(
                "Audio buffer size after push:",
                this.audioBuffer.length
              );
            }
          }
        };

        console.log("Initializing AWS client...");
        await this.transcribeClient.initialize(
          import.meta.env.VITE_AWS_REGION,
          {
            accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
            secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
          }
        );

        console.log("Starting transcription stream...");
        const command = createTranscriptionCommand(this.createAudioStream());
        console.log("Sending transcription command to AWS...");
        const response = await this.transcribeClient.startTranscription(
          command
        );

        if (!response.TranscriptResultStream) {
          throw new Error("No transcript stream received from AWS");
        }

        this.startDebugInterval();

        console.log("Processing transcription stream...");
        try {
          for await (const event of response.TranscriptResultStream) {
            if (!this.isTranscribing) break;

            console.log("Received event from AWS:", event);

            if (event.TranscriptEvent?.Transcript?.Results?.[0]) {
              const result = event.TranscriptEvent.Transcript.Results[0];
              if (result.Alternatives?.[0]?.Transcript) {
                const transcription = result.Alternatives[0].Transcript;
                if (!result.IsPartial) {
                  console.log("Received final transcription:", transcription);
                  useMeetingStore
                    .getState()
                    .appendTranscript(transcription + " ");
                } else {
                  console.log("Received partial transcription:", transcription);
                }
              }
            }
          }
        } catch (error) {
          console.error("Error processing transcription stream:", error);
          if (error instanceof Error) {
            console.error("Error details:", error.message);
            console.error("Error stack:", error.stack);
          }
          throw error;
        }
      } finally {
        URL.revokeObjectURL(workletUrl);
      }
    } catch (error) {
      console.error("Transcription error:", error);
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
        console.log(
          "Sending processed audio chunk of size:",
          processedChunk.length
        );

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
    console.log("Stopping transcription...");
    this.isTranscribing = false;

    if (this.debugInterval) {
      window.clearInterval(this.debugInterval);
      this.debugInterval = null;
    }

    this.streamManager.stop();
    this.audioContext.close();
    this.transcribeClient.destroy();
    this.audioBuffer = [];
    console.log("Transcription stopped and cleaned up");
  }
}

export const transcriptionService = new TranscriptionService();

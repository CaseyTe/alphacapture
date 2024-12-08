export class AudioProcessor {
  private readonly targetSampleRate: number;
  private readonly channels: number;
  private readonly bitsPerSample: number;

  constructor(targetSampleRate = 16000, channels = 1, bitsPerSample = 16) {
    this.targetSampleRate = targetSampleRate;
    this.channels = channels;
    this.bitsPerSample = bitsPerSample;
  }

  processAudioChunk(float32Array: Float32Array): Uint8Array {
    // Convert Float32Array to Int16Array (AWS Transcribe expects 16-bit PCM)
    const int16Array = new Int16Array(float32Array.length);
    
    for (let i = 0; i < float32Array.length; i++) {
      // Normalize and convert to 16-bit PCM
      const sample = Math.max(-1, Math.min(1, float32Array[i]));
      int16Array[i] = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
    }

    // Return as Uint8Array for AWS Transcribe
    return new Uint8Array(int16Array.buffer);
  }
}
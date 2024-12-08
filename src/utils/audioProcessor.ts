export class AudioProcessor {
  private readonly sampleRate: number;
  private readonly channels: number;
  private readonly bitsPerSample: number;
  private readonly blockAlign: number;
  private readonly byteRate: number;

  constructor(sampleRate = 16000, channels = 1, bitsPerSample = 16) {
    this.sampleRate = sampleRate;
    this.channels = channels;
    this.bitsPerSample = bitsPerSample;
    this.blockAlign = (this.channels * this.bitsPerSample) / 8;
    this.byteRate = this.sampleRate * this.blockAlign;
  }

  convertFloat32ToInt16(float32Array: Float32Array): Int16Array {
    const int16Array = new Int16Array(float32Array.length);
    for (let i = 0; i < float32Array.length; i++) {
      const s = Math.max(-1, Math.min(1, float32Array[i]));
      int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
    return int16Array;
  }

  processAudioChunk(float32Array: Float32Array): Uint8Array {
    const int16Array = this.convertFloat32ToInt16(float32Array);
    return new Uint8Array(int16Array.buffer);
  }
}
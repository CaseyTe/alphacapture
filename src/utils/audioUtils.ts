export class AudioResampler {
  private readonly inputSampleRate: number;
  private readonly outputSampleRate: number;
  private buffer: Float32Array;
  private bufferOffset: number;
  private resampleRatio: number;

  constructor(inputSampleRate: number, outputSampleRate: number, bufferSize: number = 4096) {
    this.inputSampleRate = inputSampleRate;
    this.outputSampleRate = outputSampleRate;
    this.buffer = new Float32Array(bufferSize);
    this.bufferOffset = 0;
    this.resampleRatio = inputSampleRate / outputSampleRate;
  }

  process(inputData: Float32Array): Float32Array {
    const outputLength = Math.floor(inputData.length / this.resampleRatio);
    const output = new Float32Array(outputLength);
    
    for (let i = 0; i < outputLength; i++) {
      const inputIndex = Math.floor(i * this.resampleRatio);
      output[i] = inputData[inputIndex];
    }
    
    return output;
  }

  // Convert Float32Array to 16-bit PCM
  static convertToPCM(float32Array: Float32Array): Int16Array {
    const pcmData = new Int16Array(float32Array.length);
    for (let i = 0; i < float32Array.length; i++) {
      const s = Math.max(-1, Math.min(1, float32Array[i]));
      pcmData[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
    return pcmData;
  }
}
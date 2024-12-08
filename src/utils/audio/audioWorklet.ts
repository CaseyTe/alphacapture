export const audioWorkletCode = `
class AudioProcessor extends AudioWorkletProcessor {
  constructor(options) {
    super();
    this.targetSampleRate = options.processorOptions.targetSampleRate || 16000;
    this.sampleRatio = sampleRate / this.targetSampleRate;
    this.lastProcessedTime = 0;
    this.processInterval = 20; // Process more frequently
    this.bufferSize = 2048;
    this.buffer = new Float32Array(this.bufferSize);
    this.bufferIndex = 0;
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];
    if (!input || !input[0]) return true;

    const inputData = input[0];
    if (inputData.length === 0) return true;

    // Fill buffer with input data
    for (let i = 0; i < inputData.length && this.bufferIndex < this.bufferSize; i++) {
      this.buffer[this.bufferIndex++] = inputData[i];
    }

    // If buffer is full, process and send it
    if (this.bufferIndex >= this.bufferSize) {
      const downsampledData = this.downsample(this.buffer);
      this.port.postMessage(downsampledData.buffer, [downsampledData.buffer]);
      
      // Reset buffer
      this.buffer = new Float32Array(this.bufferSize);
      this.bufferIndex = 0;
    }

    return true;
  }

  downsample(inputData) {
    const outputLength = Math.floor(inputData.length / this.sampleRatio);
    const result = new Float32Array(outputLength);

    for (let i = 0; i < outputLength; i++) {
      const inputIndex = Math.floor(i * this.sampleRatio);
      result[i] = inputData[inputIndex];
    }

    return result;
  }
}

registerProcessor('audio-processor', AudioProcessor);
`;
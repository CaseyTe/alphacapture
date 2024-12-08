export const audioWorkletCode = `
class AudioProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this._buffer = new Float32Array(1024);
    this._bufferSize = 0;
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];
    if (input && input.length > 0) {
      const audioData = input[0];
      if (audioData.length > 0) {
        this.port.postMessage(audioData);
      }
    }
    return true;
  }
}

registerProcessor('audio-processor', AudioProcessor);
`;
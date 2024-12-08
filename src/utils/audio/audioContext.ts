export class AudioContextManager {
  private context: AudioContext | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private workletNode: AudioWorkletNode | null = null;

  async initialize(stream: MediaStream, workletUrl: string): Promise<AudioWorkletNode> {
    try {
      if (this.context) {
        await this.close();
      }

      this.context = new (window.AudioContext || window.webkitAudioContext)({
        sampleRate: 16000, // Match AWS Transcribe requirements directly
        latencyHint: 'interactive'
      });

      console.log('Audio context initialized with sample rate:', this.context.sampleRate);

      await this.context.audioWorklet.addModule(workletUrl);
      this.source = this.context.createMediaStreamSource(stream);
      this.workletNode = new AudioWorkletNode(this.context, 'audio-processor', {
        numberOfInputs: 1,
        numberOfOutputs: 1,
        processorOptions: {
          targetSampleRate: 16000
        }
      });
      
      this.source.connect(this.workletNode);
      console.log('Audio processing pipeline established');
      
      return this.workletNode;
    } catch (error) {
      console.error('Failed to initialize audio context:', error);
      throw new Error('Could not initialize audio processing. Please check your microphone access.');
    }
  }

  getState() {
    return this.context?.state || 'closed';
  }

  async close() {
    try {
      if (this.workletNode) {
        this.workletNode.disconnect();
        this.workletNode = null;
      }

      if (this.source) {
        this.source.disconnect();
        this.source = null;
      }

      if (this.context) {
        await this.context.close();
        this.context = null;
      }
    } catch (error) {
      console.error('Error closing audio context:', error);
    }
  }
}
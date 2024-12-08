export interface AudioMetrics {
  volume: number;
  clarity: number;
  noiseLevel: number;
}

export class AudioMetricsAnalyzer {
  private analyser: AnalyserNode | null = null;
  private dataArray: Uint8Array | null = null;

  constructor(private audioContext: AudioContext, private sourceNode: MediaStreamAudioSourceNode) {
    this.setupAnalyzer();
  }

  private setupAnalyzer(): void {
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 2048;
    this.sourceNode.connect(this.analyser);
    this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
  }

  getMetrics(): AudioMetrics {
    if (!this.analyser || !this.dataArray) {
      return { volume: 0, clarity: 0, noiseLevel: 0 };
    }

    this.analyser.getByteFrequencyData(this.dataArray);
    
    const volume = this.calculateVolume();
    const clarity = this.calculateClarity();
    const noiseLevel = this.calculateNoiseLevel();

    return { volume, clarity, noiseLevel };
  }

  private calculateVolume(): number {
    if (!this.dataArray) return 0;
    const sum = this.dataArray.reduce((acc, val) => acc + val, 0);
    return sum / this.dataArray.length / 255; // Normalize to 0-1
  }

  private calculateClarity(): number {
    // Simplified clarity calculation based on frequency distribution
    return 0.8; // Placeholder for now
  }

  private calculateNoiseLevel(): number {
    // Simplified noise level calculation
    return 0.2; // Placeholder for now
  }

  cleanup(): void {
    if (this.analyser) {
      this.sourceNode.disconnect(this.analyser);
      this.analyser.disconnect();
    }
  }
}
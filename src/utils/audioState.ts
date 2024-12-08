import { AppError, errorMessages } from './errors';

export type RecordingState = 'idle' | 'recording' | 'paused' | 'error';

export interface AudioState {
  state: RecordingState;
  error: string | null;
  duration: number;
  volume: number;
}

export class AudioStateManager {
  private state: AudioState = {
    state: 'idle',
    error: null,
    duration: 0,
    volume: 0,
  };

  private timer: NodeJS.Timeout | null = null;

  setState(newState: Partial<AudioState>) {
    this.state = { ...this.state, ...newState };
  }

  getState(): AudioState {
    return { ...this.state };
  }

  startTimer() {
    if (this.timer) {
      clearInterval(this.timer);
    }

    this.timer = setInterval(() => {
      if (this.state.state === 'recording') {
        this.setState({ duration: this.state.duration + 1 });
      }
    }, 1000);
  }

  stopTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  reset() {
    this.stopTimer();
    this.setState({
      state: 'idle',
      error: null,
      duration: 0,
      volume: 0,
    });
  }

  setError(error: Error) {
    this.setState({
      state: 'error',
      error: error instanceof AppError ? error.message : errorMessages.UNKNOWN_ERROR,
    });
  }

  cleanup() {
    this.stopTimer();
  }
}
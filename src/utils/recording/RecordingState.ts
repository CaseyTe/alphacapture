export type RecordingStatus = 'idle' | 'initializing' | 'recording' | 'paused' | 'error';

export interface RecordingState {
  status: RecordingStatus;
  error: string | null;
  duration: number;
}

export const initialRecordingState: RecordingState = {
  status: 'idle',
  error: null,
  duration: 0,
};
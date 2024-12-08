export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface ErrorState {
  message: string;
  code?: string;
  details?: unknown;
}

export interface AsyncState {
  loading: LoadingState;
  error: ErrorState | null;
}
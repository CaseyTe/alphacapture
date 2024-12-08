export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const errorMessages = {
  // Audio Recording
  MICROPHONE_ACCESS_DENIED: 'Microphone access was denied. Please enable microphone access in your browser settings.',
  NO_MICROPHONE_FOUND: 'No microphone was found. Please connect a microphone and try again.',
  MICROPHONE_BUSY: 'Your microphone is busy or not responding. Please check your audio settings.',
  MICROPHONE_ERROR: 'Failed to access microphone. Please check your audio settings.',
  
  // Browser Support
  BROWSER_NOT_SUPPORTED: 'Your browser does not support audio recording. Please use a modern browser.',
  AUDIO_CONTEXT_NOT_SUPPORTED: 'Your browser does not support audio processing. Please use a modern browser.',
  
  // Recording States
  RECORDING_IN_PROGRESS: 'A recording is already in progress.',
  RECORDING_NOT_STARTED: 'Recording has not been started.',
  INVALID_RECORDING_STATE: 'Invalid recording state. Please refresh and try again.',
  
  // AWS & OpenAI
  AWS_CREDENTIALS_MISSING: 'AWS credentials are not configured. Please check your environment variables.',
  TRANSCRIPTION_FAILED: 'Failed to transcribe audio. Please check your internet connection.',
  SUMMARY_GENERATION_FAILED: 'Failed to generate meeting summary. Please try again later.',
  
  // General
  NETWORK_ERROR: 'Network connection error. Please check your internet connection.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
} as const;

export type ErrorCode = keyof typeof errorMessages;
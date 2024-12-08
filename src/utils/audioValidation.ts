import { AppError, errorMessages } from './errors';

export function validateAudioState(isRecording: boolean, stream: MediaStream): void {
  if (!stream || !stream.active) {
    throw new AppError(
      errorMessages.MICROPHONE_ERROR,
      'NO_AUDIO_STREAM'
    );
  }

  const audioTrack = stream.getAudioTracks()[0];
  if (!audioTrack) {
    throw new AppError(
      errorMessages.NO_MICROPHONE_FOUND,
      'NO_AUDIO_TRACK'
    );
  }

  if (!audioTrack.enabled || audioTrack.muted) {
    throw new AppError(
      errorMessages.MICROPHONE_ERROR,
      'AUDIO_TRACK_DISABLED'
    );
  }

  if (audioTrack.readyState !== 'live') {
    throw new AppError(
      errorMessages.INVALID_RECORDING_STATE,
      'INVALID_TRACK_STATE'
    );
  }

  // Additional validation for recording state
  if (isRecording && !stream.active) {
    throw new AppError(
      errorMessages.INVALID_RECORDING_STATE,
      'STREAM_INACTIVE'
    );
  }
}

export function validateRecordingState(isRecording: boolean, expectedState: boolean): void {
  if (isRecording !== expectedState) {
    throw new AppError(
      isRecording ? errorMessages.RECORDING_IN_PROGRESS : errorMessages.RECORDING_NOT_STARTED,
      isRecording ? 'ALREADY_RECORDING' : 'NOT_RECORDING'
    );
  }
}
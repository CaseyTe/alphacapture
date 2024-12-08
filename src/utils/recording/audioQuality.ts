import { AppError } from '../errors';

export interface AudioQualityConfig {
  echoCancellation: boolean;
  noiseSuppression: boolean;
  autoGainControl: boolean;
  sampleRate: number;
  channelCount: number;
}

export const defaultAudioConfig: AudioQualityConfig = {
  echoCancellation: true,
  noiseSuppression: true,
  autoGainControl: true,
  sampleRate: 44100,
  channelCount: 1,
};

export function validateAudioQuality(stream: MediaStream): boolean {
  const audioTrack = stream.getAudioTracks()[0];
  if (!audioTrack) {
    throw new AppError('No audio track found', 'NO_AUDIO_TRACK');
  }

  const settings = audioTrack.getSettings();
  const constraints = audioTrack.getConstraints();

  // Check if the track is properly initialized
  if (!settings || audioTrack.muted || !audioTrack.enabled) {
    throw new AppError('Audio track not properly initialized', 'INVALID_TRACK');
  }

  // Verify the audio track is live and ready
  if (audioTrack.readyState !== 'live') {
    throw new AppError('Audio track not live', 'TRACK_NOT_LIVE');
  }

  // Check sample rate if available
  if (settings.sampleRate && settings.sampleRate < defaultAudioConfig.sampleRate) {
    throw new AppError('Sample rate too low', 'INVALID_SAMPLE_RATE');
  }

  // Check channel count if available
  if (settings.channelCount && settings.channelCount !== defaultAudioConfig.channelCount) {
    throw new AppError('Invalid channel count', 'INVALID_CHANNEL_COUNT');
  }

  // Verify echo cancellation is enabled if supported
  if (constraints.echoCancellation === false) {
    throw new AppError('Echo cancellation disabled', 'ECHO_CANCELLATION_DISABLED');
  }

  return true;
}
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
  if (!audioTrack) return false;

  const settings = audioTrack.getSettings();
  const constraints = audioTrack.getConstraints();

  // Check if the track is properly initialized
  if (!settings || audioTrack.muted || !audioTrack.enabled) {
    return false;
  }

  // Verify the audio track is live and ready
  if (audioTrack.readyState !== 'live') {
    return false;
  }

  // Check sample rate if available
  if (settings.sampleRate && settings.sampleRate < defaultAudioConfig.sampleRate) {
    return false;
  }

  // Check channel count if available
  if (settings.channelCount && settings.channelCount !== defaultAudioConfig.channelCount) {
    return false;
  }

  // Verify echo cancellation is enabled if supported
  if (constraints.echoCancellation === false) {
    return false;
  }

  return true;
}

export function getOptimalAudioConfig(): AudioQualityConfig {
  // In the future, we could detect device capabilities and adjust accordingly
  return {
    ...defaultAudioConfig
  };
}
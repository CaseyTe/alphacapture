import { useState, useCallback, useEffect } from 'react';
import { AudioStateManager, AudioState } from '../utils/audioState';

export function useAudioState() {
  const [audioState, setAudioState] = useState<AudioState>({
    state: 'idle',
    error: null,
    duration: 0,
    volume: 0,
  });

  const audioStateManager = new AudioStateManager();

  useEffect(() => {
    const updateState = () => {
      setAudioState(audioStateManager.getState());
    };

    // Update state every second while recording
    const interval = setInterval(updateState, 1000);

    return () => {
      clearInterval(interval);
      audioStateManager.cleanup();
    };
  }, []);

  const startRecording = useCallback(() => {
    audioStateManager.setState({ state: 'recording' });
    audioStateManager.startTimer();
    setAudioState(audioStateManager.getState());
  }, []);

  const pauseRecording = useCallback(() => {
    audioStateManager.setState({ state: 'paused' });
    audioStateManager.stopTimer();
    setAudioState(audioStateManager.getState());
  }, []);

  const resumeRecording = useCallback(() => {
    audioStateManager.setState({ state: 'recording' });
    audioStateManager.startTimer();
    setAudioState(audioStateManager.getState());
  }, []);

  const stopRecording = useCallback(() => {
    audioStateManager.reset();
    setAudioState(audioStateManager.getState());
  }, []);

  const setError = useCallback((error: Error) => {
    audioStateManager.setError(error);
    setAudioState(audioStateManager.getState());
  }, []);

  return {
    audioState,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    setError,
  };
}
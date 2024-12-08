import { useState, useCallback, useRef, useEffect } from 'react';
import { RecordingManager } from '../utils/recording/RecordingManager';
import { RecordingState, initialRecordingState } from '../utils/recording/RecordingState';
import { useMeetingStore } from '../store/meetingStore';
import { Logger } from '../utils/recording/logger';

export function useRecording() {
  const { addTranscriptLine } = useMeetingStore();
  const [state, setState] = useState<RecordingState>(initialRecordingState);
  const recordingManagerRef = useRef<RecordingManager | null>(null);
  const durationInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      stopDurationTracking();
      if (recordingManagerRef.current) {
        recordingManagerRef.current.cleanup();
        recordingManagerRef.current = null;
      }
    };
  }, []);

  const updateDuration = useCallback(() => {
    setState(prev => ({
      ...prev,
      duration: prev.duration + 1
    }));
  }, []);

  const startDurationTracking = useCallback(() => {
    stopDurationTracking();
    durationInterval.current = setInterval(updateDuration, 1000);
  }, [updateDuration]);

  const stopDurationTracking = useCallback(() => {
    if (durationInterval.current) {
      clearInterval(durationInterval.current);
      durationInterval.current = null;
    }
  }, []);

  const startRecording = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, status: 'initializing', error: null }));

      // Create new instance for each recording session
      recordingManagerRef.current = new RecordingManager(addTranscriptLine);
      
      Logger.debug('Starting recording session');
      await recordingManagerRef.current.startRecording();
      
      setState(prev => ({ ...prev, status: 'recording', error: null }));
      startDurationTracking();
    } catch (error) {
      Logger.error(error as Error, 'startRecording');
      setState(prev => ({
        ...prev,
        status: 'error',
        error: error instanceof Error ? error.message : 'Failed to start recording'
      }));
      throw error;
    }
  }, [addTranscriptLine, startDurationTracking]);

  const stopRecording = useCallback(async () => {
    try {
      if (!recordingManagerRef.current) {
        return;
      }

      await recordingManagerRef.current.stopRecording();
      stopDurationTracking();
      setState(initialRecordingState);
      
      // Clear the manager after stopping
      recordingManagerRef.current = null;
    } catch (error) {
      Logger.error(error as Error, 'stopRecording');
      setState(prev => ({
        ...prev,
        status: 'error',
        error: error instanceof Error ? error.message : 'Failed to stop recording'
      }));
      throw error;
    }
  }, [stopDurationTracking]);

  const pauseRecording = useCallback(async () => {
    try {
      if (!recordingManagerRef.current) {
        return;
      }

      await recordingManagerRef.current.pauseRecording();
      stopDurationTracking();
      setState(prev => ({ ...prev, status: 'paused' }));
    } catch (error) {
      Logger.error(error as Error, 'pauseRecording');
      setState(prev => ({
        ...prev,
        status: 'error',
        error: error instanceof Error ? error.message : 'Failed to pause recording'
      }));
      throw error;
    }
  }, [stopDurationTracking]);

  const resumeRecording = useCallback(async () => {
    try {
      if (!recordingManagerRef.current) {
        recordingManagerRef.current = new RecordingManager(addTranscriptLine);
      }

      await recordingManagerRef.current.resumeRecording();
      setState(prev => ({ ...prev, status: 'recording', error: null }));
      startDurationTracking();
    } catch (error) {
      Logger.error(error as Error, 'resumeRecording');
      setState(prev => ({
        ...prev,
        status: 'error',
        error: error instanceof Error ? error.message : 'Failed to resume recording'
      }));
      throw error;
    }
  }, [addTranscriptLine, startDurationTracking]);

  return {
    state,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
  };
}
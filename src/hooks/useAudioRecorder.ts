import { useCallback, useRef, useEffect, useState } from 'react';
import { useMeetingStore } from '../store/meetingStore';
import { AudioRecorder } from '../utils/audioRecorder';
import { AppError } from '../utils/errors';

export function useAudioRecorder() {
  const { addTranscriptLine } = useMeetingStore();
  const recorderRef = useRef<AudioRecorder | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, []);

  const cleanup = useCallback(() => {
    if (recorderRef.current) {
      recorderRef.current.stopRecording();
      recorderRef.current = null;
    }
    setIsInitialized(false);
  }, []);

  const initializeRecording = useCallback(async () => {
    if (isInitialized) return;

    try {
      recorderRef.current = new AudioRecorder(addTranscriptLine);
      setIsInitialized(true);
    } catch (error: any) {
      cleanup();
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error.message || 'Failed to initialize recording', 'INIT_ERROR', error);
    }
  }, [addTranscriptLine, cleanup, isInitialized]);

  const startRecording = useCallback(async () => {
    try {
      await initializeRecording();
      if (!recorderRef.current) {
        throw new AppError('Recording not properly initialized', 'INIT_ERROR');
      }
      await recorderRef.current.startRecording();
    } catch (error) {
      cleanup();
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to start recording', 'RECORDING_ERROR', error);
    }
  }, [initializeRecording, cleanup]);

  const stopRecording = useCallback(async () => {
    try {
      if (recorderRef.current) {
        await recorderRef.current.stopRecording();
      }
      cleanup();
    } catch (error) {
      cleanup();
      throw new AppError('Failed to stop recording', 'STOP_RECORDING_ERROR', error);
    }
  }, [cleanup]);

  const pauseRecording = useCallback(async () => {
    try {
      if (!recorderRef.current) {
        throw new AppError('No active recording', 'NO_RECORDING');
      }
      await recorderRef.current.pauseRecording();
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to pause recording', 'PAUSE_RECORDING_ERROR', error);
    }
  }, []);

  const resumeRecording = useCallback(async () => {
    try {
      if (!isInitialized) {
        await initializeRecording();
      }
      if (!recorderRef.current) {
        throw new AppError('Recording not properly initialized', 'INIT_ERROR');
      }
      await recorderRef.current.resumeRecording();
    } catch (error) {
      cleanup();
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to resume recording', 'RESUME_RECORDING_ERROR', error);
    }
  }, [initializeRecording, cleanup, isInitialized]);

  return {
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    isInitialized,
  };
}
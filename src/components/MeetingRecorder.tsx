import React, { useState } from 'react';
import { useMeetingStore } from '../store/meetingStore';
import { useRecording } from '../hooks/useRecording';
import { ErrorAlert } from './ErrorAlert';
import { LoadingSpinner } from './LoadingSpinner';
import { AudioControls } from './AudioControls';

export function MeetingRecorder() {
  const [title, setTitle] = useState('');
  const [showTitleInput, setShowTitleInput] = useState(true);
  
  const { 
    createMeeting,
    startRecording: startMeetingRecording,
    pauseRecording: pauseMeetingRecording,
    stopRecording: stopMeetingRecording
  } = useMeetingStore();

  const {
    state: recordingState,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording
  } = useRecording();

  const handleStartNewMeeting = async () => {
    if (!title.trim()) {
      return;
    }

    try {
      createMeeting(title);
      await startRecording();
      startMeetingRecording();
      setShowTitleInput(false);
    } catch (error: any) {
      console.error('Failed to start recording:', error);
    }
  };

  const handlePauseResume = async () => {
    try {
      if (recordingState.status === 'recording') {
        await pauseRecording();
        pauseMeetingRecording();
      } else {
        await resumeRecording();
        startMeetingRecording();
      }
    } catch (error: any) {
      console.error('Recording error:', error);
    }
  };

  const handleStop = async () => {
    try {
      await stopRecording();
      await stopMeetingRecording();
      setShowTitleInput(true);
      setTitle('');
    } catch (error: any) {
      console.error('Failed to stop recording:', error);
    }
  };

  const isLoading = recordingState.status === 'initializing';
  const hasError = recordingState.status === 'error';

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      {hasError && (
        <div className="mb-4">
          <ErrorAlert 
            error={{ message: recordingState.error || 'Recording error occurred' }} 
            onDismiss={() => null}
          />
        </div>
      )}
      
      {isLoading && (
        <div className="mb-4">
          <LoadingSpinner 
            size="sm" 
            message="Initializing recording..." 
          />
        </div>
      )}
      
      {showTitleInput ? (
        <div className="flex space-x-2">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter meeting title..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            disabled={isLoading}
          />
          <button
            onClick={handleStartNewMeeting}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading || !title.trim()}
          >
            Start Recording
          </button>
        </div>
      ) : (
        <AudioControls
          onStart={handleStartNewMeeting}
          onPause={handlePauseResume}
          onResume={handlePauseResume}
          onStop={handleStop}
          disabled={isLoading}
          status={recordingState.status}
          duration={recordingState.duration}
        />
      )}
    </div>
  );
}
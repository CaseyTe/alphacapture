import React from 'react';
import { Mic, MicOff, Pause, Play, Square } from 'lucide-react';
import { formatDuration } from '../utils/format';
import { RecordingStatus } from '../utils/recording/RecordingState';

interface AudioControlsProps {
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  disabled?: boolean;
  status: RecordingStatus;
  duration: number;
}

export function AudioControls({
  onStart,
  onPause,
  onResume,
  onStop,
  disabled = false,
  status,
  duration,
}: AudioControlsProps) {
  const renderControls = () => {
    switch (status) {
      case 'recording':
        return (
          <>
            <button
              onClick={onPause}
              className="flex items-center space-x-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
              disabled={disabled}
            >
              <Pause className="h-5 w-5" />
              <span>Pause</span>
            </button>
            <button
              onClick={onStop}
              className="flex items-center space-x-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              disabled={disabled}
            >
              <Square className="h-5 w-5" />
              <span>Stop</span>
            </button>
          </>
        );

      case 'paused':
        return (
          <>
            <button
              onClick={onResume}
              className="flex items-center space-x-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
              disabled={disabled}
            >
              <Play className="h-5 w-5" />
              <span>Resume</span>
            </button>
            <button
              onClick={onStop}
              className="flex items-center space-x-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              disabled={disabled}
            >
              <Square className="h-5 w-5" />
              <span>Stop</span>
            </button>
          </>
        );

      case 'error':
        return (
          <button
            onClick={onStart}
            className="flex items-center space-x-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
            disabled={disabled}
          >
            <Mic className="h-5 w-5" />
            <span>Retry Recording</span>
          </button>
        );

      default:
        return (
          <button
            onClick={onStart}
            className="flex items-center space-x-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
            disabled={disabled}
          >
            <Mic className="h-5 w-5" />
            <span>Start Recording</span>
          </button>
        );
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
      <div className="flex items-center space-x-4">
        {renderControls()}
      </div>
      {status !== 'idle' && status !== 'error' && (
        <div className="flex items-center space-x-2">
          {status === 'recording' ? (
            <Mic className="h-5 w-5 text-red-500 animate-pulse" />
          ) : (
            <MicOff className="h-5 w-5 text-gray-500" />
          )}
          <span className="text-sm text-gray-600">
            {formatDuration(duration)}
          </span>
        </div>
      )}
    </div>
  );
}
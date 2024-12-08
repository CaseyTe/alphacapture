import React, { useState } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { useMeetingStore } from '../store/useMeetingStore';

export const MeetingRecorder: React.FC = () => {
  const { isRecording, transcript, startRecording, stopRecording } = useMeetingStore();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleStartRecording = async () => {
    try {
      setError(null);
      setIsLoading(true);
      await startRecording();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 
        'Failed to start recording. Please check your microphone access and try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex flex-col items-center space-y-4 mb-8">
        <button
          onClick={isRecording ? stopRecording : handleStartRecording}
          disabled={isLoading}
          className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
            isLoading ? 'bg-gray-400 cursor-not-allowed' :
            isRecording
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Initializing...
            </span>
          ) : isRecording ? (
            <>
              <MicOff className="w-5 h-5 mr-2" />
              Stop Recording
            </>
          ) : (
            <>
              <Mic className="w-5 h-5 mr-2" />
              Start Recording
            </>
          )}
        </button>
        
        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-4 rounded-lg w-full max-w-md border border-red-200">
            <p className="font-medium">Error</p>
            <p>{error}</p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Transcript</h2>
        <div className="min-h-[200px] max-h-[400px] overflow-y-auto whitespace-pre-wrap bg-gray-50 p-4 rounded-md text-gray-700">
          {transcript || 'Transcript will appear here...'}
        </div>
      </div>
    </div>
  );
};
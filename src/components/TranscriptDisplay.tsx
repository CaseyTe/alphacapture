import React from 'react';
import { useMeetingStore } from '../store/useMeetingStore';

export const TranscriptDisplay: React.FC = () => {
  const { transcript } = useMeetingStore();

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">
        Transcript
      </h2>
      <div className="min-h-[200px] max-h-[400px] overflow-y-auto whitespace-pre-wrap bg-gray-50 p-4 rounded-md text-gray-700">
        {transcript || "Transcript will appear here..."}
      </div>
    </div>
  );
};
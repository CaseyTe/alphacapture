import React from 'react';
import { useMeetingStore } from '../../store/useMeetingStore';

export const TranscriptDisplay: React.FC = () => {
  const { transcript } = useMeetingStore();

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Live Transcript</h2>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="min-h-[300px] max-h-[500px] overflow-y-auto">
          <div className="whitespace-pre-wrap text-gray-700">
            {transcript || "Transcript will appear here..."}
          </div>
        </div>
      </div>
    </div>
  );
};
import React from 'react';
import { useMeetingStore } from '../store/useMeetingStore';

export const SummaryDisplay: React.FC = () => {
  const { summary } = useMeetingStore();

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 h-[calc(100vh-10rem)] sticky top-8">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Meeting Summary</h2>
      <div className="h-[calc(100%-3rem)] overflow-y-auto">
        <div className="prose prose-sm max-w-none whitespace-pre-wrap bg-gray-50 p-4 rounded-md text-gray-700 min-h-full">
          {summary || "Summary will appear here after 30 seconds of recording..."}
        </div>
      </div>
    </div>
  );
}
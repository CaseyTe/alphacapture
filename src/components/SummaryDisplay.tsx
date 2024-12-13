import React from 'react';
import { useMeetingStore } from '../store/useMeetingStore';

export const SummaryDisplay: React.FC = () => {
  const { summary } = useMeetingStore();

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Summary</h2>
      <div className="min-h-[100px] max-h-[200px] overflow-y-auto whitespace-pre-wrap bg-gray-50 p-4 rounded-md text-gray-700">
        {summary || "Summary will appear here after 30 seconds of recording..."}
      </div>
    </div>
  );
};
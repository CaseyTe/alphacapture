import React from 'react';
import { useMeetingStore } from '../../store/useMeetingStore';

export const SummaryDisplay: React.FC = () => {
  const { summary } = useMeetingStore();

  return (
    <div className="bg-white rounded-lg shadow-md p-6 h-full min-h-[calc(100vh-theme(spacing.32))]">
      <div className="h-full whitespace-pre-wrap text-gray-700">
        {summary || "Summary will appear here after 30 seconds of recording..."}
      </div>
    </div>
  );
};
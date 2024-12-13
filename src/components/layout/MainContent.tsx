import React from 'react';
import { SummaryDisplay } from '../meeting/SummaryDisplay';

export const MainContent: React.FC = () => {
  return (
    <div className="flex-1">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Meeting Summary</h2>
      <SummaryDisplay />
    </div>
  );
};
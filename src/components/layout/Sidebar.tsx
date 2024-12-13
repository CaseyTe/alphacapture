import React from 'react';
import { Tag } from 'lucide-react';
import { TopicsInput } from '../topics/TopicsInput';
import { TranscriptDisplay } from '../meeting/TranscriptDisplay';
import { RecordingControls } from '../RecordingControls';

export const Sidebar: React.FC = () => {
  return (
    <div className="w-[400px] space-y-6">
      <div className="flex items-center gap-2">
        <Tag className="w-5 h-5 text-indigo-600" />
        <h2 className="text-lg font-semibold text-gray-800">Meeting Topics</h2>
      </div>
      <TopicsInput />
      <TranscriptDisplay />
      <RecordingControls />
    </div>
  );
};
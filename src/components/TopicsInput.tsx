import React from 'react';
import { useMeetingStore } from '../store/useMeetingStore';

interface TopicsInputProps {
  disabled?: boolean;
}

export const TopicsInput: React.FC<TopicsInputProps> = ({ disabled }) => {
  const { meetingTopics, updateMeetingTopics } = useMeetingStore();

  return (
    <div className="w-full max-w-2xl mb-4">
      <label
        htmlFor="topics"
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        Meeting Topics
      </label>
      <textarea
        id="topics"
        rows={3}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        placeholder="Enter the topics to be discussed in this meeting..."
        value={meetingTopics}
        onChange={(e) => updateMeetingTopics(e.target.value)}
        disabled={disabled}
      />
      {disabled && (
        <p className="mt-1 text-sm text-gray-500">
          Topics cannot be modified during recording
        </p>
      )}
    </div>
  );
};
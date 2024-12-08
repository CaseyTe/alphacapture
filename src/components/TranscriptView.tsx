import React from 'react';
import { useMeetingStore } from '../store/meetingStore';
import { format } from 'date-fns';

export function TranscriptView() {
  const { activeMeeting } = useMeetingStore();

  if (!activeMeeting) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Live Transcript</h2>
        <span className="text-sm text-gray-500">
          {format(new Date(activeMeeting.date), 'PPp')}
        </span>
      </div>
      <div className="h-64 overflow-y-auto bg-gray-50 rounded-lg p-4">
        {activeMeeting.transcript.length === 0 ? (
          <p className="text-gray-500 text-center">
            Transcript will appear here when recording starts...
          </p>
        ) : (
          <div className="space-y-2">
            {activeMeeting.transcript.map((line, index) => (
              <p key={index} className="text-gray-700">
                {line}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
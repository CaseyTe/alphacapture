import React from 'react';
import { FileText, Loader, AlertTriangle } from 'lucide-react';
import { useMeetingStore } from '../store/meetingStore';

export function MeetingSummary() {
  const { activeMeeting } = useMeetingStore();

  if (!activeMeeting) {
    return null;
  }

  const renderContent = () => {
    if (activeMeeting.status !== 'completed') {
      return (
        <p className="text-gray-500 text-center">
          Summary will be generated when the meeting ends.
        </p>
      );
    }

    if (activeMeeting.summaryError) {
      return (
        <div className="flex flex-col items-center justify-center space-y-2 text-red-500">
          <AlertTriangle className="h-6 w-6" />
          <p className="text-center">Failed to generate summary. Please try again.</p>
        </div>
      );
    }

    if (!activeMeeting.summary) {
      return (
        <div className="flex items-center justify-center space-x-2 text-gray-500">
          <Loader className="h-5 w-5 animate-spin" />
          <span>Generating summary...</span>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {activeMeeting.summary.split('\n').map((line, index) => (
          <p key={index} className="text-gray-700">
            {line}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
      <div className="flex items-center mb-4">
        <FileText className="h-6 w-6 text-orange-500 mr-2" />
        <h2 className="text-lg font-semibold">Meeting Summary</h2>
      </div>
      <div className="bg-gray-50 rounded-lg p-4">
        {renderContent()}
      </div>
    </div>
  );
}
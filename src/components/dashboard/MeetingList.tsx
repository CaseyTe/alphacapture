import React from 'react';
import { MeetingCard } from '../MeetingCard';
import { Meeting } from '../../types/meeting';
import { EmptyState } from '../EmptyState';

interface MeetingListProps {
  meetings: Meeting[];
  onNewMeeting: () => void;
}

export function MeetingList({ meetings, onNewMeeting }: MeetingListProps) {
  if (meetings.length === 0) {
    return <EmptyState onNewMeeting={onNewMeeting} />;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Meetings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {meetings.map((meeting) => (
            <MeetingCard
              key={meeting.id}
              meeting={meeting}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
import React, { useState, useCallback } from 'react';
import { MeetingRecorder } from './MeetingRecorder';
import { TranscriptView } from './TranscriptView';
import { MeetingSummary } from './MeetingSummary';
import { MeetingNotes } from './MeetingNotes';
import { DashboardHeader } from './dashboard/DashboardHeader';
import { DashboardStats } from './dashboard/DashboardStats';
import { MeetingList } from './dashboard/MeetingList';
import { useMeetingStore } from '../store/meetingStore';

export function Dashboard() {
  const { meetings, activeMeeting } = useMeetingStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewMeeting, setShowNewMeeting] = useState(false);

  const filteredMeetings = meetings.filter(meeting => 
    meeting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    meeting.transcript.some(line => 
      line.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleNewMeeting = useCallback(() => {
    setShowNewMeeting(true);
  }, []);

  return (
    <div className="pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <DashboardHeader 
        onSearch={handleSearch}
        onNewMeeting={handleNewMeeting}
      />

      {showNewMeeting && (
        <MeetingRecorder onClose={() => setShowNewMeeting(false)} />
      )}
      
      {activeMeeting && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <TranscriptView />
          <div className="space-y-6">
            <MeetingSummary />
            <MeetingNotes />
          </div>
        </div>
      )}

      <DashboardStats />

      <MeetingList 
        meetings={filteredMeetings}
        onNewMeeting={handleNewMeeting}
      />
    </div>
  );
}
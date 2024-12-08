import React from 'react';
import { Clock, FileText, Calendar, Play, Square } from 'lucide-react';
import { format } from 'date-fns';
import { Meeting } from '../types/meeting';
import { useMeetingStore } from '../store/meetingStore';

interface MeetingCardProps {
  meeting: Meeting;
}

export function MeetingCard({ meeting }: MeetingCardProps) {
  const { activeMeeting, startRecording, stopRecording } = useMeetingStore();

  const getStatusColor = (status: Meeting['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleToggleRecording = async () => {
    if (meeting.status === 'completed') {
      return;
    }

    if (activeMeeting?.id === meeting.id) {
      await stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-medium text-gray-900">{meeting.title}</h3>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(meeting.status)}`}>
          {meeting.status}
        </span>
      </div>
      <div className="space-y-2">
        <div className="flex items-center text-sm text-gray-500">
          <Calendar className="h-4 w-4 mr-2" />
          {format(new Date(meeting.date), 'PPp')}
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <Clock className="h-4 w-4 mr-2" />
          {Math.floor(meeting.duration / 60)} minutes
        </div>
        {meeting.summary && (
          <div className="flex items-start text-sm text-gray-500">
            <FileText className="h-4 w-4 mr-2 mt-1" />
            <p className="line-clamp-2">{meeting.summary}</p>
          </div>
        )}
      </div>
      {meeting.status !== 'completed' && (
        <button
          onClick={handleToggleRecording}
          className={`mt-4 w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
            activeMeeting?.id === meeting.id
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-orange-500 hover:bg-orange-600 text-white'
          }`}
        >
          {activeMeeting?.id === meeting.id ? (
            <>
              <Square className="h-5 w-5" />
              <span>Stop Recording</span>
            </>
          ) : (
            <>
              <Play className="h-5 w-5" />
              <span>Resume Recording</span>
            </>
          )}
        </button>
      )}
    </div>
  );
}
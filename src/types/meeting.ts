export interface Meeting {
  id: string;
  title: string;
  date: string;
  status: 'active' | 'paused' | 'completed';
  transcript: string[];
  summary?: string;
  summaryError?: string;
  notes?: string;
  duration: number; // in seconds
}

export interface MeetingStore {
  meetings: Meeting[];
  activeMeeting: Meeting | null;
  isRecording: boolean;
  createMeeting: (title: string) => void;
  updateMeeting: (id: string, updates: Partial<Meeting>) => void;
  startRecording: () => void;
  pauseRecording: () => void;
  stopRecording: () => void;
  addTranscriptLine: (text: string) => void;
  generateSummary: (meetingId: string) => Promise<void>;
}
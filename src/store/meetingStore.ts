import { create } from 'zustand';
import { MeetingStore, Meeting } from '../types/meeting';
import { generateMeetingSummary } from '../utils/openai';
import { storage } from '../utils/storage';

export const useMeetingStore = create<MeetingStore>((set, get) => ({
  meetings: storage.loadMeetings(),
  activeMeeting: null,
  isRecording: false,

  createMeeting: (title) => {
    const newMeeting: Meeting = {
      id: Date.now().toString(),
      title,
      date: new Date().toISOString(),
      status: 'active',
      transcript: [],
      duration: 0,
    };

    set((state) => {
      const newState = {
        meetings: [newMeeting, ...state.meetings],
        activeMeeting: newMeeting,
      };
      storage.saveMeetings(newState.meetings);
      return newState;
    });
  },

  updateMeeting: (id, updates) => {
    set((state) => {
      const newState = {
        meetings: state.meetings.map((meeting) =>
          meeting.id === id ? { ...meeting, ...updates } : meeting
        ),
        activeMeeting:
          state.activeMeeting?.id === id
            ? { ...state.activeMeeting, ...updates }
            : state.activeMeeting,
      };
      storage.saveMeetings(newState.meetings);
      return newState;
    });
  },

  generateSummary: async (meetingId) => {
    const meeting = get().meetings.find(m => m.id === meetingId);
    if (!meeting) return;

    try {
      const summary = await generateMeetingSummary(meeting);
      set((state) => {
        const newState = {
          meetings: state.meetings.map((m) =>
            m.id === meetingId ? { ...m, summary, summaryError: undefined } : m
          ),
          activeMeeting: state.activeMeeting?.id === meetingId
            ? { ...state.activeMeeting, summary, summaryError: undefined }
            : state.activeMeeting,
        };
        storage.saveMeetings(newState.meetings);
        return newState;
      });
    } catch (error: any) {
      set((state) => {
        const newState = {
          meetings: state.meetings.map((m) =>
            m.id === meetingId ? { ...m, summaryError: error.message } : m
          ),
          activeMeeting: state.activeMeeting?.id === meetingId
            ? { ...state.activeMeeting, summaryError: error.message }
            : state.activeMeeting,
        };
        storage.saveMeetings(newState.meetings);
        return newState;
      });
    }
  },

  startRecording: () => {
    set({ isRecording: true });
  },

  pauseRecording: () => {
    set((state) => ({
      isRecording: false,
      activeMeeting: state.activeMeeting
        ? { ...state.activeMeeting, status: 'paused' }
        : null,
    }));
  },

  stopRecording: async () => {
    const { activeMeeting, generateSummary } = get();
    if (activeMeeting) {
      set({ isRecording: false });
      
      const updatedMeeting = {
        ...activeMeeting,
        status: 'completed' as const,
      };
      
      set((state) => {
        const newState = {
          meetings: state.meetings.map((m) =>
            m.id === updatedMeeting.id ? updatedMeeting : m
          ),
          activeMeeting: updatedMeeting,
        };
        storage.saveMeetings(newState.meetings);
        return newState;
      });

      // Generate summary after meeting is completed
      await generateSummary(updatedMeeting.id);
    }
  },

  addTranscriptLine: (text) => {
    set((state) => {
      if (!state.activeMeeting) return state;
      
      const updatedMeeting = {
        ...state.activeMeeting,
        transcript: [...state.activeMeeting.transcript, text],
      };
      
      const newState = {
        activeMeeting: updatedMeeting,
        meetings: state.meetings.map((m) =>
          m.id === updatedMeeting.id ? updatedMeeting : m
        ),
      };
      
      storage.saveMeetings(newState.meetings);
      return newState;
    });
  },
}));
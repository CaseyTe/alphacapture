import { create } from "zustand";
import { transcriptionService } from "../utils/transcription/TranscriptionService";
import { TranscriptService } from "../services/transcript/transcriptService";
import { v4 as uuidv4 } from 'uuid';
import type { SearchResult } from "../services/transcript/types";

const transcriptService = new TranscriptService();

interface MeetingState {
  isRecording: boolean;
  transcript: string;
  summary: string;
  meetingTopics: string;
  meetingScore: {
    overall: number;
    depth: number;
    topicAdherence: number;
    pace: number;
    analysis: string;
  } | null;
  searchQuery: string;
  searchResults: SearchResult[];
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  appendTranscript: (text: string) => void;
  clearTranscript: () => void;
  updateSummary: (newSummary: string) => void;
  updateMeetingTopics: (topics: string) => void;
  updateMeetingScore: (score: MeetingState["meetingScore"]) => void;
  searchTranscripts: (query: string) => Promise<void>;
  saveMeeting: () => Promise<void>;
}

export const useMeetingStore = create<MeetingState>((set, get) => ({
  isRecording: false,
  transcript: "",
  summary: "",
  meetingTopics: "",
  meetingScore: null,
  searchQuery: "",
  searchResults: [],

  startRecording: async () => {
    try {
      if (get().isRecording) return;
      set({ isRecording: true, summary: "" });
      await transcriptionService.startTranscription();
    } catch (error) {
      console.error("Failed to start recording:", error);
      throw error;
    }
  },

  stopRecording: () => {
    if (!get().isRecording) return;
    transcriptionService.stopTranscription();
    set({ isRecording: false });
  },

  appendTranscript: (text: string) => {
    set((state) => ({
      transcript: state.transcript + text,
    }));
  },

  clearTranscript: () => {
    set({ transcript: "", summary: "" });
  },

  updateSummary: (newSummary: string) => {
    set({ summary: newSummary });
  },

  updateMeetingTopics: (topics: string) => {
    set({ meetingTopics: topics });
  },

  updateMeetingScore: (score) => set({ meetingScore: score }),

  searchTranscripts: async (query: string) => {
    try {
      const results = await transcriptService.searchTranscripts(query);
      set({ searchQuery: query, searchResults: results });
    } catch (error) {
      console.error('Error searching transcripts:', error);
      throw error;
    }
  },

  saveMeeting: async () => {
    try {
      const { transcript, summary } = get();
      const meetingId = uuidv4();
      await transcriptService.storeTranscript(meetingId, transcript, summary);
      return meetingId;
    } catch (error) {
      console.error('Error saving meeting:', error);
      throw error;
    }
  },
}));
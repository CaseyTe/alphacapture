import { create } from "zustand";
import { transcriptionService } from "../utils/transcription/TranscriptionService";

export interface MeetingState {
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
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  appendTranscript: (text: string) => void;
  clearTranscript: () => void;
  updateSummary: (newSummary: string) => void;
  updateMeetingTopics: (topics: string) => void;
  updateMeetingScore: (score: MeetingState["meetingScore"]) => void;
}

export const useMeetingStore = create<MeetingState>((set, get) => ({
  isRecording: false,
  transcript: "",
  summary: "",
  meetingTopics: "",
  meetingScore: null,

  startRecording: async () => {
    try {
      if (get().isRecording) {
        return;
      }
      set({ isRecording: true, summary: "" });
      await transcriptionService.startTranscription();
    } catch (error) {
      console.error("Failed to start recording:", error);
      throw error;
    }
  },

  stopRecording: () => {
    if (!get().isRecording) {
      return;
    }
    transcriptionService.stopTranscription();
    set({ isRecording: false });
  },

  appendTranscript: (text: string) => {
    console.log("Appending transcript:", text);
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
}));

import { create } from "zustand";
import { transcriptionService } from "../utils/transcription/TranscriptionService";
import { TranscriptService } from "../services/transcript/transcriptService";
import { v4 as uuidv4 } from "uuid";
import type { SearchResult, MeetingScore } from "../utils/supabase/types";

const transcriptService = new TranscriptService();

export interface MeetingState {
  isRecording: boolean;
  isPaused: boolean;
  transcript: string;
  summary: string;
  meetingTopics: string;
  userId: string | null;
  meetingScore: MeetingScore | null;
  meetingName: string;
  searchQuery: string;
  searchResults: SearchResult[];
  notification: { message: string; type: "success" | "error" | "info" } | null;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  pauseRecording: () => void;
  resumeRecording: () => void;
  appendTranscript: (text: string) => void;
  clearTranscript: () => void;
  updateSummary: (newSummary: string) => void;
  updateMeetingTopics: (topics: string) => void;
  updateMeetingScore: (score: MeetingScore | null) => void;
  searchTranscripts: (query: string) => Promise<void>;
  updateMeetingName: (name: string) => void;
  saveMeeting: () => Promise<void>;
  login: (userId: string) => void;
  logout: () => void;
  showNotification: (
    message: string,
    type: "success" | "error" | "info"
  ) => void;
  clearNotification: () => void;
}

export const useMeetingStore = create<MeetingState>((set, get) => ({
  isRecording: false,
  isPaused: false,
  transcript: "",
  summary: "",
  meetingTopics: "",
  userId: null,
  meetingScore: null,
  meetingName: "",
  searchQuery: "",
  searchResults: [],
  notification: null,

  startRecording: async () => {
    if (get().isRecording) {
      console.log("Recording is already in progress.");
      return;
    }
    try {
      set({ isRecording: true, isPaused: false, summary: "" });
      console.log("Recording started.");
      await transcriptionService.startTranscription();
      console.log("Transcription service started.");
      get().showNotification("Recording started.", "success");
    } catch (error) {
      console.error("Failed to start recording:", error);
      set({ isRecording: false });
      get().showNotification("Failed to start recording.", "error");
      throw error;
    }
  },

  stopRecording: () => {
    if (!get().isRecording) {
      console.log("No active recording to stop.");
      return;
    }
    transcriptionService.stopTranscription();
    set({ isRecording: false, isPaused: false });
    console.log("Recording stopped.");
    get().showNotification("Recording stopped.", "success");
  },

  pauseRecording: () => {
    if (!get().isRecording || get().isPaused) {
      console.log("Recording is not active or already paused.");
      return;
    }
    transcriptionService.stopTranscription();
    set({ isPaused: true });
    console.log("Recording paused.");
    get().showNotification("Recording paused.", "info");
  },

  resumeRecording: () => {
    if (!get().isRecording || !get().isPaused) {
      console.log("Recording is not paused or not active.");
      return;
    }
    transcriptionService.startTranscription();
    set({ isPaused: false });
    console.log("Recording resumed.");
    get().showNotification("Recording resumed.", "success");
  },

  appendTranscript: (text) => {
    set((state) => ({ transcript: state.transcript + text }));
    console.log(
      `Appended transcript: ${
        text.length
      } characters. Total transcript length: ${
        get().transcript.length + text.length
      }`
    );
  },

  updateMeetingName: (name) => {
    set({ meetingName: name });
    console.log("Meeting name updated.");
  },

  clearTranscript: () => {
    set({ transcript: "", summary: "" });
    console.log("Transcript and summary cleared.");
    get().showNotification("Transcript and summary cleared.", "info");
  },

  updateSummary: (newSummary) => {
    set({ summary: newSummary });
    console.log("Summary updated.");
  },

  updateMeetingTopics: (topics) => {
    set({ meetingTopics: topics });
    console.log("Meeting topics updated.");
  },

  updateMeetingScore: (score) => {
    set({ meetingScore: score });
    console.log("Meeting score updated.");
  },

  searchTranscripts: async (query) => {
    try {
      const results = await transcriptService.searchTranscripts(query);
      console.log("Transcripts searched with query:", query);
      console.log("Results:", results);
      set({ searchQuery: query, searchResults: results });
      console.log("Transcripts searched with query:", query);
    } catch (error) {
      console.error("Error searching transcripts:", error);
      get().showNotification("Error searching transcripts.", "error");
      throw error;
    }
  },

  saveMeeting: async () => {
    try {
      const { transcript, summary, meetingScore, meetingName } = get();
      const meetingId = uuidv4();
      // TODO: AWAIT A RESPONSE FROM OPENAI FOR THE FULL SUMMARY BASED ON THE FULL TRANSCRIPT
      await transcriptService.storeTranscript(
        meetingId,
        transcript,
        summary,
        meetingName,
        meetingScore
      );

      set({ transcript: "", summary: "" });
      console.log("Meeting saved with ID:", meetingId);
      get().showNotification("Meeting saved successfully.", "success");
      return;
    } catch (error) {
      console.error("Error saving meeting:", error);
      get().showNotification("Error saving meeting.", "error");
      throw error;
    }
  },

  login: (userId) => set({ userId }),
  logout: () => set({ userId: null }),

  showNotification: (message, type) => set({ notification: { message, type } }),
  clearNotification: () => set({ notification: null }),
}));

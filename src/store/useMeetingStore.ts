import { create } from 'zustand';
import { transcriptionService } from '../utils/transcription/TranscriptionService';

interface MeetingState {
  isRecording: boolean;
  transcript: string;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  appendTranscript: (text: string) => void;
}

export const useMeetingStore = create<MeetingState>((set, get) => ({
  isRecording: false,
  transcript: '',
  
  startRecording: async () => {
    try {
      if (get().isRecording) {
        return;
      }

      await transcriptionService.startTranscription();
      set({ isRecording: true });
    } catch (error) {
      console.error('Failed to start recording:', error);
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
    console.log('Appending transcript:', text);
    set((state) => ({
      transcript: state.transcript + text,
    }));
  },
}));
import { Meeting } from '../types/meeting';

const STORAGE_KEY = 'alphacapture_meetings';

export const storage = {
  saveMeetings(meetings: Meeting[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(meetings));
    } catch (error) {
      console.error('Failed to save meetings:', error);
    }
  },

  loadMeetings(): Meeting[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load meetings:', error);
      return [];
    }
  },

  clearMeetings(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear meetings:', error);
    }
  }
};
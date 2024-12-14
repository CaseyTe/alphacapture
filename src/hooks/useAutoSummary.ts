import { useEffect, useCallback } from "react";
import { useMeetingStore } from "../store/useMeetingStore";
import { generateSummary } from "../utils/openai/summaryService";

export const useAutoSummary = () => {
  const {
    transcript,
    meetingTopics,
    updateSummary,
    updateMeetingScore,
    isRecording,
  } = useMeetingStore();

  useEffect(() => {
    console.log("useAutoSummary effect running", {
      isRecording,
      hasTranscript: !!transcript,
    });

    if (!isRecording) return;

    const intervalId = setInterval(async () => {
      console.log("Generating new summary..."); // Debug log
      try {
        const result = await generateSummary(transcript, meetingTopics);
        console.log("New summary generated:", result.summary); // Debug log
        updateSummary(result.summary);
        updateMeetingScore(result.score);
      } catch (error) {
        console.error("Error generating summary:", error);
      }
    }, 5000);

    return () => {
      console.log("Cleaning up summary interval"); // Debug log
      clearInterval(intervalId);
    };
  }, [
    isRecording,
    transcript,
    meetingTopics,
    updateSummary,
    updateMeetingScore,
  ]);
};

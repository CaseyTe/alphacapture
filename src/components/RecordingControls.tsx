import React from "react";
import { Mic, Pause, Play, Square, Save } from "lucide-react";
import { useMeetingStore } from "../store/useMeetingStore";
import { useAutoSummary } from "../hooks/useAutoSummary";

export const RecordingControls: React.FC = () => {
  const {
    isRecording,
    isPaused,
    transcript,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    saveMeeting,
  } = useMeetingStore();

  useAutoSummary();

  const handleStartRecording = async () => {
    try {
      console.log("Starting recording...");
      await startRecording();
    } catch (error) {
      console.error("Failed to start recording:", error);
    }
  };

  const handleStopRecording = async () => {
    try {
      await stopRecording();
      await saveMeeting();
    } catch (error) {
      console.error("Failed to stop recording:", error);
    }
  };

  const handlePauseRecording = () => {
    pauseRecording();
  };

  const handleResumeRecording = () => {
    resumeRecording();
  };

  if (!isRecording) {
    return (
      <button
        onClick={handleStartRecording}
        className="w-full flex items-center justify-center px-6 py-3 rounded-lg font-medium bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
      >
        <Mic className="w-5 h-5 mr-2" />
        Start Recording
      </button>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      <button
        onClick={handleStopRecording}
        className="flex items-center justify-center px-6 py-3 rounded-lg font-medium bg-red-600 hover:bg-red-700 text-white transition-colors"
      >
        <Square className="w-5 h-5 mr-2" />
        Stop Meeting
      </button>

      <button
        onClick={isPaused ? handleResumeRecording : handlePauseRecording}
        className={`flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-colors ${
          isPaused
            ? "bg-green-600 hover:bg-green-700 text-white"
            : "bg-orange-500 hover:bg-orange-600 text-white"
        }`}
      >
        {isPaused ? (
          <>
            <Play className="w-5 h-5 mr-2" />
            Resume Meeting
          </>
        ) : (
          <>
            <Pause className="w-5 h-5 mr-2" />
            Pause Meeting
          </>
        )}
      </button>
    </div>
  );
};

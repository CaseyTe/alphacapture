import React, { useState } from "react";
import { Mic, MicOff } from "lucide-react";
import { useMeetingStore } from "../store/useMeetingStore";

export const MeetingRecorder: React.FC = () => {
  const {
    isRecording,
    transcript,
    startRecording,
    stopRecording,
    clearTranscript,
  } = useMeetingStore();
  const [error, setError] = useState<string | null>(null);

  const handleStartRecording = async () => {
    try {
      setError(null);
      await startRecording();
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to start recording. Please check your microphone access and try again.";
      setError(errorMessage);
    }
  };

  const handleStopRecording = () => {
    stopRecording();
    downloadTranscript();
    clearTranscript();
  };

  const downloadTranscript = () => {
    const element = document.createElement("a");
    const file = new Blob([transcript], { type: "text/plain" });
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    element.href = URL.createObjectURL(file);
    element.download = `transcript-${timestamp}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex flex-col items-center space-y-4 mb-8">
        <button
          onClick={isRecording ? handleStopRecording : handleStartRecording}
          className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
            isRecording
              ? "bg-red-600 hover:bg-red-700 text-white"
              : "bg-indigo-600 hover:bg-indigo-700 text-white"
          }`}
        >
          {isRecording ? (
            <>
              <MicOff className="w-5 h-5 mr-2" />
              Stop Recording
            </>
          ) : (
            <>
              <Mic className="w-5 h-5 mr-2" />
              Start Recording
            </>
          )}
        </button>

        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-4 rounded-lg w-full max-w-md border border-red-200">
            <p className="font-medium">Error</p>
            <p>{error}</p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Transcript</h2>
        <div className="min-h-[200px] max-h-[400px] overflow-y-auto whitespace-pre-wrap bg-gray-50 p-4 rounded-md text-gray-700">
          {transcript || "Transcript will appear here..."}
        </div>
      </div>
    </div>
  );
};

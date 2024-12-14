import React, { useEffect, useState } from "react";
import { Mic, MicOff, Save } from "lucide-react";
import { useMeetingStore } from "../store/useMeetingStore";
import { MeetingScore } from "./MeetingScore";
import { SearchTranscripts } from "./SearchTranscripts";
import { ConfigurationWarning } from "./ConfigurationWarning";
import { env } from "../config/env";
import { TopicsInput } from "./TopicsInput";
import { TranscriptDisplay } from "./TranscriptDisplay";
import { SummaryDisplay } from "./SummaryDisplay";
import { useAutoSummary } from "../hooks/useAutoSummary";

export const MeetingRecorder: React.FC = () => {
  const {
    isRecording,
    transcript,
    meetingScore,
    startRecording,
    stopRecording,
    saveMeeting,
  } = useMeetingStore();

  useAutoSummary();

  const [isSaving, setIsSaving] = useState(false);

  const canRecord =
    !!env.VITE_AWS_REGION &&
    !!env.VITE_AWS_ACCESS_KEY_ID &&
    !!env.VITE_AWS_SECRET_ACCESS_KEY;

  const canSave =
    !!env.VITE_SUPABASE_URL &&
    !!env.VITE_SUPABASE_ANON_KEY &&
    !!env.VITE_OPENAI_API_KEY;

  const handleStartRecording = async () => {
    console.log("MeetingRecorder component rendered");
    try {
      await startRecording();
    } catch (error) {
      console.error("Failed to start recording:", error);
      // TODO: Add error toast notification
    }
  };

  const handleStopRecording = () => {
    stopRecording();
  };

  const handleSaveMeeting = async () => {
    try {
      setIsSaving(true);
      await saveMeeting();
      // TODO: Add success toast notification
    } catch (error) {
      console.error("Failed to save meeting:", error);
      // TODO: Add error toast notification
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <ConfigurationWarning />

      <div className="flex flex-col items-center space-y-4 mb-8">
        <TopicsInput disabled={isRecording} />

        <div className="flex gap-4">
          <button
            onClick={isRecording ? handleStopRecording : handleStartRecording}
            disabled={!canRecord}
            className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
              isRecording
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-indigo-600 hover:bg-indigo-700 text-white"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            title={
              !canRecord
                ? "AWS configuration required for recording"
                : undefined
            }
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

          {!isRecording && transcript && (
            <button
              onClick={handleSaveMeeting}
              disabled={isSaving || !canSave}
              className="flex items-center px-6 py-3 rounded-lg font-medium bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              title={
                !canSave
                  ? "Supabase and OpenAI configuration required for saving"
                  : undefined
              }
            >
              <Save className="w-5 h-5 mr-2" />
              {isSaving ? "Saving..." : "Save Meeting"}
            </button>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <TranscriptDisplay />
        <SummaryDisplay />
        {meetingScore && <MeetingScore score={meetingScore} />}
        <SearchTranscripts />
      </div>
    </div>
  );
};

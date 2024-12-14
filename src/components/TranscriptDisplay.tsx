import React from "react";
import { useMeetingStore } from "../store/useMeetingStore";

export const TranscriptDisplay: React.FC = () => {
  const { transcript } = useMeetingStore();

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">
        Live Transcript
      </h2>
      <div className="h-[300px] overflow-y-auto">
        <div className="whitespace-pre-wrap bg-gray-50 p-4 rounded-md text-gray-700 min-h-full">
          {transcript || "Transcript will appear here..."}
        </div>
      </div>
    </div>
  );
};

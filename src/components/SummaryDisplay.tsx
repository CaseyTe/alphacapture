import React from "react";
import { useMeetingStore } from "../store/useMeetingStore";
import { MeetingScore } from "./MeetingScore";

export const SummaryDisplay: React.FC = () => {
  const { summary, meetingScore, userId } = useMeetingStore();

  if (!userId) {
    return (
      <div className="bg-white rounded-lg p-6 sticky top-8">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Meeting Summary
        </h2>
        <p className="text-gray-500">Please log in to view the summary.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 sticky top-8">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">
        Meeting Summary
      </h2>
      <div className="overflow-y-auto mb-4">
        <div className="prose prose-sm max-w-none whitespace-pre-wrap bg-gray-50 p-4 rounded-md text-gray-700">
          {summary ||
            "Summary will appear here every 5 seconds of recording..."}
        </div>
      </div>
      {meetingScore && (
        <div className="mt-4">
          <MeetingScore score={meetingScore} />
        </div>
      )}
    </div>
  );
};

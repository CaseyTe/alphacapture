import React from "react";
import { FileText } from "lucide-react";
import { useMeetingStore } from "../store/useMeetingStore";

export const MeetingNameInput: React.FC = () => {
  const { meetingName, updateMeetingName, isRecording } = useMeetingStore();

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FileText className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            value={meetingName}
            onChange={(e) => updateMeetingName(e.target.value)}
            placeholder="Enter meeting name..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm
              focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
              placeholder:text-gray-400"
          />
        </div>
      </div>
    </div>
  );
};

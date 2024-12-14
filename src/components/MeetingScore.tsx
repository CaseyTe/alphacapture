import React from "react";
import type { MeetingState } from "../store/useMeetingStore";

interface ScoreProps {
  label: string;
  score: number;
}

const ScoreIndicator: React.FC<ScoreProps> = ({ label, score }) => (
  <div className="flex flex-col items-center">
    <div className="text-sm text-gray-600 mb-1">{label}</div>
    <div
      className={`text-xl font-bold ${
        score >= 7
          ? "text-green-600"
          : score >= 4
          ? "text-yellow-600"
          : "text-red-600"
      }`}
    >
      {score.toFixed(1)}
    </div>
  </div>
);

export const MeetingScore: React.FC<{
  score: MeetingState["meetingScore"];
}> = ({ score }) => {
  if (!score) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">
        Meeting Score
      </h2>
      <div className="grid grid-cols-4 gap-4 mb-4">
        <ScoreIndicator label="Overall" score={score.overall} />
        <ScoreIndicator label="Depth" score={score.depth} />
        <ScoreIndicator label="On Topic" score={score.topicAdherence} />
        <ScoreIndicator label="Pace" score={score.pace} />
      </div>
      <div className="mt-4 text-sm text-gray-600">
        <p className="font-medium">Analysis:</p>
        <p>{score.analysis}</p>
      </div>
    </div>
  );
};

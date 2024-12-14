import { MeetingScore } from "../supabase/types";

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.error("OpenAI API key is not set in environment variables");
}

interface MeetingSummaryResponse {
  summary: string;
  analysis: string;
  score: MeetingScore;
}

export const generateSummary = async (
  transcript: string,
  meetingTopics: string
): Promise<MeetingSummaryResponse> => {
  try {
    if (!OPENAI_API_KEY) {
      throw new Error("OpenAI API key is not configured");
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant that analyzes business meetings. Provide a summary and scoring analysis.",
          },
          {
            role: "user",
            content: `Analyze this meeting and provide: 1) A summary of key points and action items, and 2) Numerical scores (0-10) for overall quality, discussion depth, topic adherence, and meeting pace.\n\nIntended Topics:\n${
              meetingTopics || "No specific topics provided"
            }\n\nTranscript:\n${transcript}`,
          },
        ],
        functions: [
          {
            name: "analyze_meeting",
            parameters: {
              type: "object",
              properties: {
                summary: { type: "string" },
                score: {
                  type: "object",
                  properties: {
                    overall: { type: "number" },
                    depth: { type: "number" },
                    topicAdherence: { type: "number" },
                    pace: { type: "number" },
                    analysis: { type: "string" },
                  },
                  required: [
                    "overall",
                    "depth",
                    "topicAdherence",
                    "pace",
                    "analysis",
                  ],
                },
              },
              required: ["summary", "score"],
            },
          },
        ],
        function_call: { name: "analyze_meeting" },
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to generate summary: ${response.statusText}`);
    }

    const data = await response.json();
    return JSON.parse(data.choices[0].message.function_call.arguments);
  } catch (error) {
    console.error("Error generating summary:", error);
    return {
      summary:
        "Failed to generate summary. Please check your API key configuration.",
      analysis: "Failed to analyze meeting.",
      score: {
        overall: 0,
        depth: 0,
        on_topic: 0,
        pace: 0,
      },
    };
  }
};

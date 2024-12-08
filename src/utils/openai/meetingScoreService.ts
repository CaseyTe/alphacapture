import { z } from "zod";

const MeetingScore = z.object({
  overall: z.number().min(0).max(10),
  depth: z.number().min(0).max(10),
  topicAdherence: z.number().min(0).max(10),
  pace: z.number().min(0).max(10),
  analysis: z.string(),
});

export const generateMeetingScore = async (
  transcript: string,
  meetingTopics: string
): Promise<z.infer<typeof MeetingScore>> => {
  try {
    if (!import.meta.env.VITE_OPENAI_API_KEY) {
      throw new Error("OpenAI API key is not configured");
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content:
              "Analyze the meeting transcript and provide scores and analysis.",
          },
          {
            role: "user",
            content: `Please analyze this meeting transcript and provide scores.\n\nIntended Topics:\n${meetingTopics}\n\nTranscript:\n${transcript}`,
          },
        ],
        functions: [
          {
            name: "analyze_meeting",
            parameters: {
              type: "object",
              properties: {
                overall: {
                  type: "number",
                  description: "Overall meeting score out of 10",
                },
                depth: {
                  type: "number",
                  description: "Score for discussion depth and detail",
                },
                topicAdherence: {
                  type: "number",
                  description: "Score for staying on intended topics",
                },
                pace: {
                  type: "number",
                  description: "Score for meeting pace and efficiency",
                },
                analysis: {
                  type: "string",
                  description: "Brief analysis of the meeting performance",
                },
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
        ],
        function_call: { name: "analyze_meeting" },
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to generate meeting score: ${response.statusText}`
      );
    }

    const data = await response.json();
    const args = JSON.parse(data.choices[0].message.function_call.arguments);

    return MeetingScore.parse(args);
  } catch (error) {
    console.error("Error generating meeting score:", error);
    throw error;
  }
};

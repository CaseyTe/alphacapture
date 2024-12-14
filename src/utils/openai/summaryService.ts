const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.error("OpenAI API key is not set in environment variables");
}

export const generateSummary = async (
  transcript: string,
  meetingTopics: string
): Promise<string> => {
  try {
    if (!OPENAI_API_KEY) {
      throw new Error("OpenAI API key is not configured");
    }

    console.log("Generating summary HELLOOOOOOOO");

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
              "You are a helpful assistant that summarizes business meetings. Provide an extensive, clear summary of the key points discussed. Also give a list of action items. Make comments on whether the meeting was productive or not and if it stayed on topic.",
          },
          {
            role: "user",
            content: `Please summarize this conversation and evaluate if it addresses the intended meeting topics.\n\nIntended Meeting Topics:\n${
              meetingTopics || "No specific topics provided"
            }\n\nTranscript:\n${transcript}`,
          },
        ],
        max_tokens: 150,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("OpenAI API error:", errorData);
      throw new Error(`Failed to generate summary: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error generating summary:", error);
    return "Failed to generate summary. Please check your API key configuration.";
  }
};

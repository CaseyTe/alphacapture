import OpenAI from 'openai';
import { AppError, errorMessages } from './errors';
import { Meeting } from '../types/meeting';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

const SUMMARY_SYSTEM_PROMPT = `You are an expert meeting summarizer. Analyze meeting transcripts and create clear, actionable summaries with the following sections:

1. Key Points: Main topics and important discussions
2. Decisions: Concrete decisions and agreements reached
3. Action Items: Specific tasks, assignments, and deadlines
4. Follow-ups: Required follow-up meetings or discussions

Keep the summary professional, clear, and focused on actionable outcomes.`;

const MAX_CHUNK_SIZE = 4000; // Characters per chunk for API calls
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

function chunkTranscript(transcript: string[]): string[] {
  const chunks: string[] = [];
  let currentChunk = '';

  for (const line of transcript) {
    if ((currentChunk + line).length > MAX_CHUNK_SIZE) {
      chunks.push(currentChunk);
      currentChunk = line;
    } else {
      currentChunk += line + '\n';
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk);
  }

  return chunks;
}

async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function generateChunkSummary(chunk: string, retryCount = 0): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: SUMMARY_SYSTEM_PROMPT },
        { role: "user", content: chunk }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    const summary = response.choices[0].message.content;
    if (!summary) {
      throw new Error('Empty summary received');
    }

    return summary;
  } catch (error: any) {
    if (retryCount < MAX_RETRIES) {
      await delay(RETRY_DELAY * (retryCount + 1));
      return generateChunkSummary(chunk, retryCount + 1);
    }
    throw error;
  }
}

export async function generateMeetingSummary(meeting: Meeting): Promise<string> {
  if (!meeting.transcript.length) {
    throw new AppError(
      'Cannot generate summary for empty transcript',
      'EMPTY_TRANSCRIPT'
    );
  }

  try {
    const chunks = chunkTranscript(meeting.transcript);
    const summaries = await Promise.all(
      chunks.map(chunk => generateChunkSummary(chunk))
    );

    // If we have multiple chunks, generate a final summary
    if (summaries.length > 1) {
      const combinedSummary = await generateChunkSummary(summaries.join('\n\n'));
      return combinedSummary;
    }

    return summaries[0];
  } catch (error: any) {
    console.error('Error generating summary:', error);
    throw new AppError(
      errorMessages.SUMMARY_GENERATION_FAILED,
      'SUMMARY_GENERATION_ERROR',
      error
    );
  }
}
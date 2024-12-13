import { supabase } from './client';
import { OpenAI } from 'openai';

const CHUNK_SIZE = 1000; // Size of each text chunk for embeddings
const CHUNK_OVERLAP = 200; // Overlap between chunks

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

interface TranscriptChunk {
  meeting_id: string;
  chunk_text: string;
  chunk_embedding: number[];
  chunk_index: number;
}

export class VectorStore {
  private async generateEmbedding(text: string): Promise<number[]> {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
    });
    return response.data[0].embedding;
  }

  private chunkText(text: string): string[] {
    const chunks: string[] = [];
    let startIndex = 0;

    while (startIndex < text.length) {
      const endIndex = Math.min(startIndex + CHUNK_SIZE, text.length);
      const chunk = text.slice(startIndex, endIndex);
      chunks.push(chunk);
      startIndex = endIndex - CHUNK_OVERLAP;
    }

    return chunks;
  }

  async storeTranscript(
    meetingId: string,
    transcript: string,
    summary: string
  ): Promise<void> {
    try {
      // Store meeting metadata
      const { error: metadataError } = await supabase
        .from('meetings')
        .insert({
          id: meetingId,
          full_transcript: transcript,
          summary,
          created_at: new Date().toISOString(),
        });

      if (metadataError) throw metadataError;

      // Process and store transcript chunks with embeddings
      const chunks = this.chunkText(transcript);
      const chunkPromises = chunks.map(async (chunk, index) => {
        const embedding = await this.generateEmbedding(chunk);
        return {
          meeting_id: meetingId,
          chunk_text: chunk,
          chunk_embedding: embedding,
          chunk_index: index,
        };
      });

      const transcriptChunks = await Promise.all(chunkPromises);

      const { error: chunksError } = await supabase
        .from('transcript_chunks')
        .insert(transcriptChunks);

      if (chunksError) throw chunksError;

    } catch (error) {
      console.error('Error storing transcript:', error);
      throw error;
    }
  }

  async searchTranscripts(query: string, limit: number = 5): Promise<any[]> {
    try {
      const queryEmbedding = await this.generateEmbedding(query);

      const { data, error } = await supabase.rpc('search_transcripts', {
        query_embedding: queryEmbedding,
        match_threshold: 0.7,
        match_count: limit
      });

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error searching transcripts:', error);
      throw error;
    }
  }
}
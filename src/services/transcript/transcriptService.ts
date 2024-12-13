import { supabase } from '../../utils/supabase/client';
import { generateEmbedding } from '../../utils/openai/embeddings';
import { chunkText, DEFAULT_CHUNK_OPTIONS } from '../../utils/text/textChunker';
import type { TranscriptChunk, SearchResult, TranscriptMetadata } from './types';

export class TranscriptService {
  private checkSupabaseAvailable() {
    if (!supabase) {
      throw new Error('Supabase client is not configured. Please check your environment variables.');
    }
  }

  async storeTranscript(
    meetingId: string,
    transcript: string,
    summary: string
  ): Promise<void> {
    try {
      this.checkSupabaseAvailable();

      // Store meeting metadata
      const metadata: TranscriptMetadata = {
        id: meetingId,
        full_transcript: transcript,
        summary,
        created_at: new Date().toISOString(),
      };

      const { error: metadataError } = await supabase!
        .from('meetings')
        .insert(metadata);

      if (metadataError) throw metadataError;

      // Process and store transcript chunks with embeddings
      const chunks = chunkText(transcript, DEFAULT_CHUNK_OPTIONS);
      const chunkPromises = chunks.map(async (chunk, index) => {
        const embedding = await generateEmbedding(chunk);
        return {
          meeting_id: meetingId,
          chunk_text: chunk,
          chunk_embedding: embedding,
          chunk_index: index,
        };
      });

      const transcriptChunks = await Promise.all(chunkPromises);

      const { error: chunksError } = await supabase!
        .from('transcript_chunks')
        .insert(transcriptChunks);

      if (chunksError) throw chunksError;
    } catch (error) {
      console.error('Error storing transcript:', error);
      throw error;
    }
  }

  async searchTranscripts(query: string, limit: number = 5): Promise<SearchResult[]> {
    try {
      this.checkSupabaseAvailable();
      
      const queryEmbedding = await generateEmbedding(query);

      const { data, error } = await supabase!.rpc('search_transcripts', {
        query_embedding: queryEmbedding,
        match_threshold: 0.7,
        match_count: limit
      });

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error searching transcripts:', error);
      throw error;
    }
  }
}
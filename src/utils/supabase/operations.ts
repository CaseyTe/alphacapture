import { supabase } from './client';
import type { TranscriptChunk, TranscriptMetadata } from './types';

export class TranscriptOperations {
  private checkSupabaseAvailable() {
    if (!supabase) {
      throw new Error('Supabase client is not configured');
    }
  }

  async storeTranscriptMetadata(metadata: TranscriptMetadata) {
    this.checkSupabaseAvailable();
    const { error } = await supabase!
      .from('meetings')
      .insert(metadata);
    
    if (error) throw error;
  }

  async storeTranscriptChunks(chunks: TranscriptChunk[]) {
    this.checkSupabaseAvailable();
    const { error } = await supabase!
      .from('transcript_chunks')
      .insert(chunks);
    
    if (error) throw error;
  }

  async searchTranscripts(queryEmbedding: number[], limit: number = 5) {
    this.checkSupabaseAvailable();
    const { data, error } = await supabase!.rpc('search_transcripts', {
      query_embedding: queryEmbedding,
      match_threshold: 0.7,
      match_count: limit
    });

    if (error) throw error;
    return data || [];
  }
}
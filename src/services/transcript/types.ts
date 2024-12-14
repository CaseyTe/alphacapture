export interface TranscriptChunk {
  meeting_id: string;
  chunk_text: string;
  chunk_embedding: number[];
  chunk_index: number;
}

export interface SearchResult {
  meeting_id: string;
  chunk_text: string;
  similarity: number;
  created_at: string;
}

export interface TranscriptMetadata {
  full_transcript: string;
  summary: string;
}

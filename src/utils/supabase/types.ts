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
  meeting_name: string;
  full_transcript: string;
  summary: string;
  overall: number;
  depth: number;
  on_topic: number;
  pace: number;
}

export interface MeetingScore {
  overall: number;
  depth: number;
  on_topic: number;
  pace: number;
}

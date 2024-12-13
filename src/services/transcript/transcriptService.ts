import { supabase } from "../../utils/supabase/client";
import { generateEmbedding } from "../../utils/openai/embeddings";
import { chunkText, DEFAULT_CHUNK_OPTIONS } from "../../utils/text/textChunker";
import type {
  TranscriptChunk,
  SearchResult,
  TranscriptMetadata,
  MeetingScore,
  MeetingDocument,
} from "../../utils/supabase/types";

export class TranscriptService {
  private checkSupabaseAvailable() {
    if (!supabase) {
      throw new Error(
        "Supabase client is not configured. Please check your environment variables."
      );
    }
  }

  async storeTranscript(
    meetingId: string,
    transcript: string,
    summary: string,
    meetingName: string,
    meetingScore: MeetingScore | null
  ): Promise<void> {
    try {
      this.checkSupabaseAvailable();
      const user = await supabase!.auth.getUser();
      if (!user) {
        console.error("User is not authenticated");
        return;
      }

      // Store meeting metadata
      const meetingData: TranscriptMetadata = {
        meeting_id: meetingId,
        user_id: user.data.user?.id,
        full_transcript: transcript,
        summary: summary,
        meeting_name: meetingName,
        overall: meetingScore?.overall || 0,
        depth: meetingScore?.depth || 0,
        on_topic: meetingScore?.on_topic || 0,
        pace: meetingScore?.pace || 0,
      };

      console.log("meeting data", meetingData);

      const { error: metadataError } = await supabase!
        .from("meetings")
        .insert([meetingData]);

      if (metadataError) throw metadataError;

      // Process and store transcript chunks with embeddings
      const chunks = chunkText(transcript, DEFAULT_CHUNK_OPTIONS);
      const chunkPromises = chunks.map(async (chunk, index) => {
        const embedding: number[] = await generateEmbedding(chunk);
        const data: MeetingDocument = {
          meeting_id: meetingId,
          chunk_text: chunk,
          chunk_embedding: embedding,
          chunk_index: index,
        };
        console.log("meeting document", data);
        return data;
      });

      const transcriptChunks = await Promise.all(chunkPromises);

      const { error: chunksError } = await supabase!
        .from("meeting_documents")
        .insert(transcriptChunks);

      if (chunksError) throw chunksError;
    } catch (error) {
      console.error("Error storing transcript:", error);
      throw error;
    }
  }

  async searchTranscripts(
    query: string,
    limit: number = 5
  ): Promise<SearchResult[]> {
    try {
      this.checkSupabaseAvailable();

      const queryEmbedding = await generateEmbedding(query);

      const queryEmbeddingCasted = queryEmbedding.map((n) =>
        Number(n)
      ) as number[];
      console.log(
        "Query embedding:",
        queryEmbeddingCasted,
        limit,
        "Type of queryEmbedding:",
        typeof queryEmbeddingCasted
      );

      const { data, error } = await supabase!.rpc("search_transcripts", {
        query_embedding: queryEmbeddingCasted,
        match_threshold: 0.0,
        match_count: limit,
      });

      console.log("Search results:", data, error);

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error("Error searching transcripts:", error);
      throw error;
    }
  }
}

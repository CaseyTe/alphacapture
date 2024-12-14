import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useMeetingStore } from "../store/useMeetingStore";
import { generateEmbedding } from "../utils/openai/embeddings";
import { TranscriptService } from "../services/transcript/transcriptService";
import { generateSummary } from "../utils/openai/summaryService";
import { SearchResult } from "../utils/supabase/types";

const transcriptService = new TranscriptService();

interface SummarizedResult extends SearchResult {
  summary: string;
}

export const SearchResults: React.FC = () => {
  const { setSearchResults, showNotification } = useMeetingStore();
  const location = useLocation();
  const [summarizedResults, setSummarizedResults] = useState<
    SummarizedResult[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  const query = new URLSearchParams(location.search).get("q") || "";

  useEffect(() => {
    const performSearch = async () => {
      if (!query.trim()) {
        showNotification("No search query provided.", "info");
        return;
      }

      setIsLoading(true);
      try {
        // Search the embeddings database for top 3 matches
        const results: SearchResult[] =
          await transcriptService.searchTranscripts(query, 3);

        if (results.length === 0) {
          showNotification("No matching transcripts found.", "info");
          setSummarizedResults([]);
          return;
        }

        // For each result, generate a summary using OpenAI
        const summarizedPromises = results.map(async (result) => {
          const summaryResponse = await generateSummary(result.chunk_text, "");
          return {
            ...result,
            summary: summaryResponse.summary,
          };
        });

        const summaries = await Promise.all(summarizedPromises);
        setSummarizedResults(summaries);
      } catch (error) {
        console.error("Error during search:", error);
        showNotification("An error occurred while searching.", "error");
      } finally {
        setIsLoading(false);
      }
    };

    performSearch();
  }, [query, showNotification]);

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">
        Search Results
      </h1>
      {isLoading ? (
        <p className="text-gray-600">Searching for transcripts...</p>
      ) : summarizedResults.length === 0 ? (
        <p className="text-gray-600">No results found for "{query}".</p>
      ) : (
        <div className="space-y-6">
          {summarizedResults.map((result, index) => (
            <div
              key={`${result.meeting_id}-${index}`}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-gray-500">
                    Meeting ID: {result.meeting_id}
                  </p>
                </div>
                <div className="text-sm text-gray-500">
                  Similarity: {(result.similarity * 100).toFixed(1)}%
                </div>
              </div>
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-800">{result.chunk_text}</p>
              </div>
              <div className="mt-4">
                <h3 className="text-md font-semibold text-indigo-600">
                  Summary:
                </h3>
                <p className="text-gray-700">{result.summary}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

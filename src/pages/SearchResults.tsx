import React from 'react';
import { useMeetingStore } from '../store/useMeetingStore';
import { formatDate } from '../utils/date';

export const SearchResults: React.FC = () => {
  const { searchResults } = useMeetingStore();

  if (searchResults.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No results found. Try a different search term.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {searchResults.map((result, index) => (
        <div
          key={`${result.meeting_id}-${index}`}
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-gray-500">
                {formatDate(result.created_at)}
              </p>
            </div>
            <div className="text-sm text-gray-500">
              Match: {(result.similarity * 100).toFixed(1)}%
            </div>
          </div>
          
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-800">{result.chunk_text}</p>
          </div>
          
          <div className="mt-4">
            <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
              View Full Meeting →
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
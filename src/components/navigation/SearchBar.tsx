import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { useMeetingStore } from '../../store/useMeetingStore';

interface SearchBarProps {
  onClose: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onClose }) => {
  const [query, setQuery] = useState('');
  const { searchTranscripts } = useMeetingStore();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    await searchTranscripts(query);
  };

  return (
    <form onSubmit={handleSearch} className="flex items-center">
      <div className="relative flex items-center min-w-[300px]">
        <Search className="absolute left-3 h-5 w-5 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search transcripts..."
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          autoFocus
        />
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 p-1 rounded-full hover:bg-gray-100"
        >
          <X className="h-4 w-4 text-gray-400" />
        </button>
      </div>
    </form>
  );
};
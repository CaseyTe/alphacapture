import React, { useState } from "react";
import { Search } from "lucide-react";
import { useMeetingStore } from "../store/useMeetingStore";
import { useSearchPlaceholders } from "../hooks/useSearchPlaceholders";

export const SearchHeader: React.FC = () => {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const { searchTranscripts } = useMeetingStore();
  const { text: placeholder, opacity } = useSearchPlaceholders();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    await searchTranscripts(query);
  };

  return (
    <div className="flex justify-center">
      <form onSubmit={handleSearch} className="w-[400px]">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              if (!query) {
                setIsFocused(false);
              }
            }}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm
              focus:outline-none focus:border-indigo-500 focus:ring-0
              hover:border-gray-400"
            autoComplete="off"
            spellCheck="false"
          />
          {!isFocused && !query && (
            <div
              className="absolute inset-y-0 left-10 flex items-center pointer-events-none text-gray-400"
              style={{
                transition: "opacity 1s ease-in-out",
                opacity,
              }}
            >
              <span>{placeholder}</span>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

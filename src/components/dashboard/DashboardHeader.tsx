import React from 'react';
import { Plus } from 'lucide-react';
import { SearchBar } from '../SearchBar';

interface DashboardHeaderProps {
  onSearch: (query: string) => void;
  onNewMeeting: () => void;
}

export function DashboardHeader({ onSearch, onNewMeeting }: DashboardHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold text-gray-900">Meeting Dashboard</h1>
      <div className="flex items-center space-x-4">
        <SearchBar onSearch={onSearch} />
        <button
          onClick={onNewMeeting}
          className="flex items-center space-x-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>New Meeting</span>
        </button>
      </div>
    </div>
  );
}
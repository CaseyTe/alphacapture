import React from 'react';
import { FileText, Plus } from 'lucide-react';

interface EmptyStateProps {
  onNewMeeting: () => void;
}

export function EmptyState({ onNewMeeting }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <FileText className="mx-auto h-12 w-12 text-orange-500 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">No meetings yet</h3>
      <p className="text-gray-500 mb-6">Start recording your first meeting to get insights.</p>
      <button
        onClick={onNewMeeting}
        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
      >
        <Plus className="h-5 w-5 mr-2" />
        New Meeting
      </button>
    </div>
  );
}
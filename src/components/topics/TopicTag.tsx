import React from 'react';
import { X } from 'lucide-react';

interface TopicTagProps {
  text: string;
  onRemove: () => void;
  colorIndex: number;
}

const TAG_COLORS = [
  { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', hover: 'hover:bg-blue-100' },
  { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', hover: 'hover:bg-green-100' },
  { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', hover: 'hover:bg-purple-100' },
  { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', hover: 'hover:bg-rose-100' },
  { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', hover: 'hover:bg-amber-100' },
];

export const TopicTag: React.FC<TopicTagProps> = ({ text, onRemove, colorIndex }) => {
  const colors = TAG_COLORS[colorIndex % TAG_COLORS.length];
  
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm border transition-colors
      ${colors.bg} ${colors.text} ${colors.border} ${colors.hover}`}
    >
      {text}
      <button
        onClick={onRemove}
        className="ml-2 p-0.5 rounded-full hover:bg-white/50 focus:outline-none"
        aria-label={`Remove topic ${text}`}
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  );
};
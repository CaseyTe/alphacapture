import React, { useState } from 'react';
import { Tag, Plus, X } from 'lucide-react';
import { ContentBox } from '../layout/ContentBox';

const TOPIC_COLORS = [
  { bg: 'bg-blue-50 hover:bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
  { bg: 'bg-green-50 hover:bg-green-100', text: 'text-green-700', border: 'border-green-200' },
  { bg: 'bg-purple-50 hover:bg-purple-100', text: 'text-purple-700', border: 'border-purple-200' },
  { bg: 'bg-rose-50 hover:bg-rose-100', text: 'text-rose-700', border: 'border-rose-200' },
  { bg: 'bg-amber-50 hover:bg-amber-100', text: 'text-amber-700', border: 'border-amber-200' },
  { bg: 'bg-indigo-50 hover:bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-200' },
];

interface Topic {
  id: string;
  text: string;
  colorIndex: number;
}

export const TopicsInput: React.FC = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [inputValue, setInputValue] = useState('');

  const handleAddTopic = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      const newTopic: Topic = {
        id: Math.random().toString(36).substr(2, 9),
        text: inputValue.trim(),
        colorIndex: topics.length % TOPIC_COLORS.length,
      };
      setTopics([...topics, newTopic]);
      setInputValue('');
    }
  };

  const handleRemoveTopic = (id: string) => {
    setTopics(topics.filter(topic => topic.id !== id));
  };

  return (
    <ContentBox>
      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Tag className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleAddTopic}
              placeholder="Add meeting topics..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm
                focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
                placeholder:text-gray-400"
            />
          </div>
          <button
            onClick={() => handleAddTopic({ key: 'Enter' } as React.KeyboardEvent<HTMLInputElement>)}
            disabled={!inputValue.trim()}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm 
              font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {topics.map((topic) => {
            const colors = TOPIC_COLORS[topic.colorIndex];
            return (
              <span
                key={topic.id}
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm
                  border transition-colors ${colors.bg} ${colors.text} ${colors.border}`}
              >
                {topic.text}
                <button
                  onClick={() => handleRemoveTopic(topic.id)}
                  className="ml-2 p-0.5 rounded-full hover:bg-white/50 focus:outline-none"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            );
          })}
          {topics.length === 0 && (
            <p className="text-sm text-gray-500 italic">
              No topics added yet. Type a topic and press Enter to add it.
            </p>
          )}
        </div>
      </div>
    </ContentBox>
  );
};
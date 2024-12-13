import React, { useState, useRef } from 'react';
import { Tag, Plus } from 'lucide-react';
import { TopicTag } from './TopicTag';
import { useMeetingStore } from '../../store/useMeetingStore';

interface TopicsInputProps {
  disabled?: boolean;
}

export const TopicsInput: React.FC<TopicsInputProps> = ({ disabled }) => {
  const [inputValue, setInputValue] = useState('');
  const [topics, setTopics] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const updateMeetingTopics = useMeetingStore(state => state.updateMeetingTopics);

  const handleAddTopic = (topic: string) => {
    const trimmedTopic = topic.trim();
    if (trimmedTopic && !topics.includes(trimmedTopic)) {
      const newTopics = [...topics, trimmedTopic];
      setTopics(newTopics);
      setInputValue('');
      updateMeetingTopics(newTopics.join('\n'));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      handleAddTopic(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && topics.length > 0) {
      const newTopics = topics.slice(0, -1);
      setTopics(newTopics);
      updateMeetingTopics(newTopics.join('\n'));
    }
  };

  const handleRemoveTopic = (indexToRemove: number) => {
    const newTopics = topics.filter((_, index) => index !== indexToRemove);
    setTopics(newTopics);
    updateMeetingTopics(newTopics.join('\n'));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Tag className="h-4 w-4 text-gray-400" />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder={disabled ? "Topics cannot be modified during recording" : "Add meeting topics..."}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm
              focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
              placeholder:text-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed"
          />
        </div>
        <button
          onClick={() => handleAddTopic(inputValue)}
          disabled={disabled || !inputValue.trim()}
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
        {topics.map((topic, index) => (
          <TopicTag
            key={`${topic}-${index}`}
            text={topic}
            onRemove={() => handleRemoveTopic(index)}
            colorIndex={index}
          />
        ))}
        {topics.length === 0 && (
          <p className="text-sm text-gray-500 italic">
            No topics added yet. Type a topic and press Enter to add it.
          </p>
        )}
      </div>
    </div>
  );
};
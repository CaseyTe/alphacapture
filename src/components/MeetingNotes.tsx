import React, { useState, useEffect } from 'react';
import { useMeetingStore } from '../store/meetingStore';
import { PenSquare, Save } from 'lucide-react';

export function MeetingNotes() {
  const { activeMeeting, updateMeeting } = useMeetingStore();
  const [notes, setNotes] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (activeMeeting?.notes) {
      setNotes(activeMeeting.notes);
    }
  }, [activeMeeting]);

  const handleSaveNotes = () => {
    if (activeMeeting) {
      updateMeeting(activeMeeting.id, { notes });
      setIsEditing(false);
    }
  };

  if (!activeMeeting) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Meeting Notes</h2>
        {isEditing ? (
          <button
            onClick={handleSaveNotes}
            className="flex items-center space-x-2 text-orange-500 hover:text-orange-600"
          >
            <Save className="h-5 w-5" />
            <span>Save Notes</span>
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center space-x-2 text-orange-500 hover:text-orange-600"
          >
            <PenSquare className="h-5 w-5" />
            <span>Edit Notes</span>
          </button>
        )}
      </div>
      {isEditing ? (
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full h-48 p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="Add your meeting notes here..."
        />
      ) : (
        <div className="w-full h-48 p-4 bg-gray-50 rounded-lg overflow-y-auto">
          {notes ? (
            <p className="whitespace-pre-wrap">{notes}</p>
          ) : (
            <p className="text-gray-500 text-center">No notes added yet.</p>
          )}
        </div>
      )}
    </div>
  );
}
import React from "react";
import { Settings, History } from "lucide-react";

interface UserMenuProps {
  onClose: () => void;
  onLogout: () => Promise<void>;
}

export const UserMenu: React.FC<UserMenuProps> = ({ onClose, onLogout }) => {
  return (
    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1">
      <button
        className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-gray-50"
        onClick={() => {
          // Handle settings click
          onClose();
        }}
      >
        <Settings className="h-4 w-4 text-gray-500" />
        <span>User Settings</span>
      </button>

      <button
        className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-gray-50"
        onClick={() => {
          // Handle past meetings click
          onClose();
        }}
      >
        <History className="h-4 w-4 text-gray-500" />
        <span>Past Meetings</span>
      </button>
    </div>
  );
};

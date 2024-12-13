import React, { useState } from 'react';
import { Mic, User, Settings, History } from 'lucide-react';
import { UserMenu } from './UserMenu';
import { SearchHeader } from './SearchHeader';

export const Navbar: React.FC = () => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Mic className="h-8 w-8 text-indigo-600" />
            <span className="ml-2 text-xl font-semibold text-gray-900">
              AlphaBALLLLLL
            </span>
          </div>

          <div className="flex-1 max-w-2xl mx-8">
            <SearchHeader />
          </div>

          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center hover:bg-indigo-200"
            >
              <User className="h-5 w-5 text-indigo-600" />
            </button>

            {showUserMenu && (
              <UserMenu onClose={() => setShowUserMenu(false)} />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
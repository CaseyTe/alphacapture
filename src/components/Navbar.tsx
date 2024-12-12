import React from 'react';
import { Mic } from 'lucide-react';

export const Navbar: React.FC = () => {
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
        </div>
      </div>
    </nav>
  );
};
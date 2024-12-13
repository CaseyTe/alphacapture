import React from 'react';
import { Navbar } from '../navigation/Navbar';
import { Sidebar } from './Sidebar';
import { MainContent } from './MainContent';

export const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          <Sidebar />
          <div className="flex-1 min-h-[calc(100vh-theme(spacing.32))]">
            <MainContent />
          </div>
        </div>
      </div>
    </div>
  );
};
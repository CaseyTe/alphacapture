import React from 'react';
import { Navbar } from './components/Navbar';
import { TopicsInput } from './components/topics/TopicsInput';
import { TranscriptDisplay } from './components/TranscriptDisplay';
import { SummaryDisplay } from './components/SummaryDisplay';
import { RecordingControls } from './components/RecordingControls';
import { ConfigurationWarning } from './components/ConfigurationWarning';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <ConfigurationWarning />
      <main className="container mx-auto py-8 px-4">
        <div className="flex gap-6">
          {/* Left Column */}
          <div className="w-[500px] space-y-6">
            <TopicsInput />
            <TranscriptDisplay />
            <RecordingControls />
          </div>
          
          {/* Right Column */}
          <div className="flex-1">
            <SummaryDisplay />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
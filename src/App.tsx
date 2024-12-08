import React from 'react';
import { Navbar } from './components/Navbar';
import { MeetingRecorder } from './components/MeetingRecorder';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto py-8">
        <MeetingRecorder />
      </main>
    </div>
  );
}

export default App;
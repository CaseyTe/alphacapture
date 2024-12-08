import React from 'react';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { ErrorBoundary } from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main>
          <Hero />
          <Features />
          <Dashboard />
        </main>
      </div>
    </ErrorBoundary>
  );
}

export default App;
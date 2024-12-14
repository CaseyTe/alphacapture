import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { TopicsInput } from "./components/topics/TopicsInput";
import { TranscriptDisplay } from "./components/TranscriptDisplay";
import { SummaryDisplay } from "./components/SummaryDisplay";
import { RecordingControls } from "./components/RecordingControls";
import { MeetingNameInput } from "./components/MeetingName";
import { Notification } from "./components/Notification";
import { useMeetingStore } from "./store/useMeetingStore";
import { SearchResults } from "./pages/SearchResults";

function App() {
  const { notification, clearNotification } = useMeetingStore();

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              <main className="container mx-auto py-8 px-4">
                <div className="flex gap-6">
                  {/* Left Column */}
                  <div className="w-[500px] space-y-6">
                    <MeetingNameInput />
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
            }
          />
          <Route path="/search" element={<SearchResults />} />
        </Routes>
        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={clearNotification}
          />
        )}
      </div>
    </Router>
  );
}

export default App;

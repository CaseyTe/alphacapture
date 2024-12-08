# AlphaCapture

An internal meeting transcription and summarization tool built with React, TypeScript, and modern web technologies.

## Implementation Overview

### Core Features

✅ Completed:
- Project structure and architecture
- Basic UI components and layout
- Real-time audio recording setup
- AWS Transcribe integration
- Error handling system
- Loading states
- Meeting state management
- Live transcript viewing
- Basic meeting notes functionality
- Audio recording timeout handling
- Browser compatibility checks
- Improved error messages
- Recording state validation
- Component organization and modularity
- Dashboard statistics
- Meeting list management
- Search functionality

🚧 In Progress:
- OpenAI integration for summaries
- Meeting history and organization
- Dashboard analytics
- Audio quality optimization
- Advanced filtering options

⏳ Pending:
- Meeting export features
- Team collaboration features
- Advanced search capabilities
- Calendar integration

## Technical Architecture

### Recording System

The recording system has been completely refactored for better reliability and maintainability:

#### Core Components

1. **RecordingManager** (`src/utils/recording/RecordingManager.ts`)
   - Central coordinator for the recording process
   - Manages the lifecycle of recording sessions
   - Handles state transitions between recording states
   - Coordinates between audio initialization and transcription

2. **AudioInitializer** (`src/utils/recording/AudioInitializer.ts`)
   - Handles browser compatibility checks
   - Manages microphone access and permissions
   - Implements retry mechanism for stream initialization
   - Validates audio stream quality and settings

3. **TranscriptionManager** (`src/utils/recording/TranscriptionManager.ts`)
   - Manages real-time transcription using AWS Transcribe
   - Handles audio stream processing
   - Manages transcription state and cleanup
   - Processes and formats transcription results

4. **useRecording Hook** (`src/hooks/useRecording.ts`)
   - React hook for component-level recording control
   - Manages recording state and error handling
   - Provides simple interface for recording operations
   - Coordinates with the meeting store

#### Recording Flow

1. **Initialization**
   ```typescript
   const recordingManager = new RecordingManager(onTranscript);
   ```
   - Creates instances of AudioInitializer and TranscriptionManager
   - Sets up error handling and state management

2. **Starting Recording**
   ```typescript
   await recordingManager.startRecording();
   ```
   - Checks browser compatibility
   - Requests microphone access
   - Initializes audio stream with retry mechanism
   - Starts AWS Transcribe session
   - Begins processing audio chunks

3. **During Recording**
   - Audio stream is continuously processed
   - Transcription results are emitted via callback
   - Error handling and recovery is managed
   - State is maintained for pause/resume

4. **Stopping Recording**
   ```typescript
   await recordingManager.stopRecording();
   ```
   - Gracefully stops transcription
   - Cleans up audio streams
   - Releases system resources

### State Management

The application uses Zustand for state management with the following stores:

1. **Meeting Store** (`src/store/meetingStore.ts`)
   - Manages active meeting state
   - Handles meeting creation and updates
   - Stores meeting history
   - Manages recording state
   - Coordinates with local storage

2. **Audio State** (`src/utils/audioState.ts`)
   - Tracks recording status
   - Manages audio metrics
   - Handles audio device state
   - Provides audio quality information

### Error Handling

The system implements comprehensive error handling:

1. **Browser Compatibility**
   - Checks for required APIs
   - Validates browser features
   - Provides clear upgrade messages

2. **Microphone Access**
   - Permission management
   - Device availability checks
   - Connection status monitoring

3. **Stream Management**
   - Initialization retry logic
   - Stream quality validation
   - Graceful cleanup on failures

4. **Error Recovery**
   - Automatic retry mechanisms
   - Graceful degradation
   - User-friendly error messages

### Data Flow

1. **Audio Capture**
   - Browser's MediaStream API
   - Audio quality validation
   - Stream processing setup

2. **Transcription**
   - Real-time AWS Transcribe streaming
   - Text normalization
   - Partial results handling

3. **Storage**
   - Local persistence
   - State synchronization
   - History management

## Tech Stack

- React 18 with TypeScript
- Tailwind CSS for styling
- Zustand for state management
- AWS Transcribe for speech-to-text
- OpenAI API for summary generation
- Lucide React for icons
- Date-fns for date formatting
- MicrophoneStream for audio capture

## Project Structure

```
src/
├── components/          # React components
│   ├── dashboard/      # Dashboard-specific components
│   │   ├── DashboardHeader.tsx
│   │   ├── DashboardStats.tsx
│   │   └── MeetingList.tsx
│   ├── ErrorAlert.tsx
│   ├── ErrorBoundary.tsx
│   ├── LoadingSpinner.tsx
│   ├── MeetingNotes.tsx
│   ├── MeetingRecorder.tsx
│   ├── MeetingSummary.tsx
│   ├── Navbar.tsx
│   └── TranscriptView.tsx
├── hooks/              # Custom React hooks
│   ├── useRecording.ts
│   └── useAudioState.ts
├── store/              # State management
│   └── meetingStore.ts
├── types/              # TypeScript types
│   ├── common.ts
│   └── meeting.ts
├── utils/             # Utility functions
│   ├── recording/    # Recording system
│   │   ├── RecordingManager.ts
│   │   ├── AudioInitializer.ts
│   │   └── TranscriptionManager.ts
│   ├── errors.ts
│   ├── format.ts
│   └── storage.ts
└── App.tsx           # Root component
```

## Future Improvements

### Audio System
- Audio level visualization
- Noise reduction
- Echo cancellation enhancement
- Multi-device support
- Audio quality metrics

### Reliability
- Offline support
- Auto-recovery from disconnections
- Backup recording methods
- Connection quality monitoring
- Automatic state recovery

### Performance
- Audio compression
- Streaming optimization
- Caching implementation
- Resource management
- Background processing

### User Experience
- Real-time audio visualization
- Meeting templates
- Quick actions
- Keyboard shortcuts
- Accessibility improvements

### Analytics
- Meeting insights
- Usage patterns
- Performance metrics
- Error tracking
- User behavior analysis

## Known Issues

1. Occasional transcription delays with longer recordings
2. Summary generation timeout handling needs improvement
3. Meeting state persistence across page reloads
4. Audio quality validation could be more robust
5. Error recovery could be more graceful

## Next Steps

1. Complete OpenAI summary generation integration
2. Implement advanced audio quality controls
3. Add advanced filtering capabilities
4. Enhance meeting analytics
5. Implement export functionality
6. Add team collaboration features

There is consistently the following error: "Error starting recording:"{code: "RECORDING_ERROR", details: Object, name: "AppError"}
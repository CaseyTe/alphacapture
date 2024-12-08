import { 
  TranscribeStreamingClient,
  StartStreamTranscriptionCommandInput,
  StartStreamTranscriptionCommand
} from '@aws-sdk/client-transcribe-streaming';

export const createTranscribeClient = () => {
  const region = import.meta.env.VITE_AWS_REGION;
  const accessKeyId = import.meta.env.VITE_AWS_ACCESS_KEY_ID;
  const secretAccessKey = import.meta.env.VITE_AWS_SECRET_ACCESS_KEY;

  console.log('AWS Configuration:', {
    region,
    hasAccessKey: !!accessKeyId,
    hasSecretKey: !!secretAccessKey
  });

  if (!region || !accessKeyId || !secretAccessKey) {
    throw new Error('Missing AWS credentials in environment variables');
  }

  return new TranscribeStreamingClient({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey
    },
    maxAttempts: 3
  });
};

export const createTranscriptionCommand = (audioStream: AsyncIterable<any>): StartStreamTranscriptionCommand => {
  const input: StartStreamTranscriptionCommandInput = {
    LanguageCode: 'en-US',
    MediaEncoding: 'pcm',
    MediaSampleRateHertz: 16000,
    AudioStream: audioStream,
    EnablePartialResultsStabilization: true,
    PartialResultsStability: 'medium',
    ShowSpeakerLabels: false,
    EnableChannelIdentification: false
  };

  return new StartStreamTranscriptionCommand(input);
};
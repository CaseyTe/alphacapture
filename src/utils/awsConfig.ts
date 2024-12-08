import { 
  TranscribeStreamingClient,
  StartStreamTranscriptionCommandInput
} from '@aws-sdk/client-transcribe-streaming';

const REQUIRED_SAMPLE_RATE = 16000;

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

export const createTranscriptionConfig = (audioStream: AsyncIterable<any>): StartStreamTranscriptionCommandInput => {
  return {
    LanguageCode: 'en-US',
    MediaEncoding: 'pcm',
    MediaSampleRateHertz: REQUIRED_SAMPLE_RATE,
    AudioStream: audioStream,
    ShowSpeakerLabels: false,
    EnableChannelIdentification: false,
    EnablePartialResultsStabilization: true,
    PartialResultsStability: 'high'
  };
};
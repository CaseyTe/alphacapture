import { TranscribeStreamingClient } from '@aws-sdk/client-transcribe-streaming';

export const awsConfig = {
  region: 'us-east-1',
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
  },
};

export const transcribeClient = new TranscribeStreamingClient(awsConfig);
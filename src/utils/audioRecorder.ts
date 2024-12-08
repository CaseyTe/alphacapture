export const getMicrophoneStream = async (): Promise<MediaStream> => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    });
    return stream;
  } catch (error) {
    console.error('Error accessing microphone:', error);
    throw error;
  }
};
export interface ChunkOptions {
  size: number;
  overlap: number;
}

export const DEFAULT_CHUNK_OPTIONS: ChunkOptions = {
  size: 1000,
  overlap: 200,
};

export const chunkText = (text: string, options: ChunkOptions = DEFAULT_CHUNK_OPTIONS): string[] => {
  const chunks: string[] = [];
  let startIndex = 0;

  while (startIndex < text.length) {
    const endIndex = Math.min(startIndex + options.size, text.length);
    const chunk = text.slice(startIndex, endIndex);
    chunks.push(chunk);
    startIndex = endIndex - options.overlap;
  }

  return chunks;
};
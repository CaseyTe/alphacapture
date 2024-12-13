import { supabase } from '../../utils/supabase/client';
import { OpenAI } from 'openai';
import { generateEmbedding } from '../../utils/openai/embeddings';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export class RAGService {
  async getAnswerFromContext(question: string): Promise<string> {
    try {
      // Generate embedding for the question
      const questionEmbedding = await generateEmbedding(question);

      // Search for relevant context
      const { data: contexts } = await supabase!.rpc('search_transcripts', {
        query_embedding: questionEmbedding,
        match_threshold: 0.7,
        match_count: 3
      });

      if (!contexts || contexts.length === 0) {
        return "I couldn't find any relevant information in your meetings.";
      }

      // Prepare context for GPT
      const contextText = contexts
        .map(c => c.chunk_text)
        .join('\n\n');

      // Generate answer using GPT
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that answers questions about meeting transcripts. Use the provided context to answer questions accurately and concisely. If the context doesn't contain enough information to answer the question, say so."
          },
          {
            role: "user",
            content: `Context:\n${contextText}\n\nQuestion: ${question}`
          }
        ],
        temperature: 0.7,
        max_tokens: 150
      });

      return response.choices[0].message.content || "I couldn't generate an answer.";
    } catch (error) {
      console.error('Error in RAG service:', error);
      return "Sorry, I encountered an error while processing your question.";
    }
  }
}
import { z } from 'zod';

export const supabaseConfigSchema = z.object({
  url: z.string().url('Invalid Supabase URL'),
  anonKey: z.string().min(1, 'Supabase anonymous key is required'),
});

export type SupabaseConfig = z.infer<typeof supabaseConfigSchema>;

export const validateSupabaseConfig = (url?: string, anonKey?: string): SupabaseConfig | null => {
  if (!url || !anonKey) {
    console.warn('Supabase configuration is missing');
    return null;
  }

  try {
    return supabaseConfigSchema.parse({ url, anonKey });
  } catch (error) {
    console.error('Invalid Supabase configuration:', error);
    return null;
  }
};
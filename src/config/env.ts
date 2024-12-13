import { z } from 'zod';

const envSchema = z.object({
  VITE_SUPABASE_URL: z.string().url().optional(),
  VITE_SUPABASE_ANON_KEY: z.string().min(1).optional(),
  VITE_OPENAI_API_KEY: z.string().min(1).optional(),
  VITE_AWS_REGION: z.string().min(1).optional(),
  VITE_AWS_ACCESS_KEY_ID: z.string().min(1).optional(),
  VITE_AWS_SECRET_ACCESS_KEY: z.string().min(1).optional(),
});

export type EnvConfig = z.infer<typeof envSchema>;

const getEnvConfig = (): EnvConfig => {
  const config = {
    VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
    VITE_OPENAI_API_KEY: import.meta.env.VITE_OPENAI_API_KEY,
    VITE_AWS_REGION: import.meta.env.VITE_AWS_REGION,
    VITE_AWS_ACCESS_KEY_ID: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    VITE_AWS_SECRET_ACCESS_KEY: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
  };

  const result = envSchema.safeParse(config);
  
  if (!result.success) {
    console.warn('Environment validation warnings:', result.error.format());
    return config;
  }

  return result.data;
};

export const env = getEnvConfig();
import { createClient } from '@supabase/supabase-js';
import { env } from '../../config/env';

// Only create the client if the required configuration is available
const createSupabaseClient = () => {
  if (!env.VITE_SUPABASE_URL || !env.VITE_SUPABASE_ANON_KEY) {
    console.warn('Supabase configuration is missing. Some features will be disabled.');
    return null;
  }

  return createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);
};

export const supabase = createSupabaseClient();
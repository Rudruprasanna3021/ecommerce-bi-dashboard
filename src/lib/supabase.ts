import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
// Support either VITE_SUPABASE_PUBLISHABLE_KEY or VITE_SUPABASE_ANON_KEY
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseKey &&
    supabaseUrl.startsWith('https://') &&
    !supabaseUrl.includes('your-project-ref') &&
    supabaseKey.length > 20
  );
};

// Fallback dummy URL and anon key to prevent crash when initializing before Stage 4 setup
const defaultUrl = 'https://placeholder.supabase.co';
const defaultKey = 'placeholder-key';

export const supabase = createClient(
  isSupabaseConfigured() ? supabaseUrl : defaultUrl,
  isSupabaseConfigured() ? supabaseKey : defaultKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);

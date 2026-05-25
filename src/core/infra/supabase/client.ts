import { createClient } from '@supabase/supabase-js';

const dbUrl = import.meta.env.VITE_SUPABASE_URL;
const dbAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!dbUrl || !dbAnonKey) {
  console.error(
    '[supabase] Faltan VITE_SUPABASE_URL y/o VITE_SUPABASE_ANON_KEY. ' +
      'Configuralas en Vercel (Settings → Environment Variables) y en .env.local para desarrollo.'
  );
}

export const supabase = createClient(
  dbUrl || 'https://placeholder.supabase.co',
  dbAnonKey || 'placeholder-key',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
      flowType: 'pkce',
    },
  }
);

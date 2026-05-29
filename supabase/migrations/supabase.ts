import { createClient } from '@supabase/supabase-js';

// Ensure environment variables are defined in your .env file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase Environment Variables');
}

/**
 * The single Supabase client instance for the application.
 * This client handles Auth state and provides the interface for 
 * database operations, storage, and RPC calls.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
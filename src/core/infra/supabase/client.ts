import { createClient } from '@supabase/supabase-js'

const dbUrl = import.meta.env.VITE_SUPABASE_URL
const dbAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(
  dbUrl || 'https://placeholder.supabase.co',
  dbAnonKey || 'placeholder-key',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: 'implicit',
    },
  }
)

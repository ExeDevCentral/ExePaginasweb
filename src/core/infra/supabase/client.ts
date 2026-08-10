import { createClient } from '@supabase/supabase-js'

const dbUrl = import.meta.env.VITE_SUPABASE_URL
const dbAnonKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? import.meta.env.VITE_SUPABASE_ANON_KEY

if (!dbUrl || !dbAnonKey || dbUrl === '' || dbAnonKey === '') {
  console.warn(
    '[Supabase] Variables de entorno vacías. La app funcionará en modo offline. Configurá VITE_SUPABASE_URL y VITE_SUPABASE_PUBLISHABLE_KEY en .env'
  )
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
)

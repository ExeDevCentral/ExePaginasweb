import { createClient } from '@supabase/supabase-js'

type ViteEnv = ImportMeta & {
  readonly env?: {
    readonly VITE_SUPABASE_URL?: string
    readonly VITE_SUPABASE_ANON_KEY?: string
    readonly VITE_SUPABASE_PUBLISHABLE_KEY?: string
  }
}

const env = (import.meta as unknown as ViteEnv).env

const supabaseUrl = env?.VITE_SUPABASE_URL
const supabaseKey = env?.VITE_SUPABASE_ANON_KEY ?? env?.VITE_SUPABASE_PUBLISHABLE_KEY

// Client público para usar desde el navegador.
export const supabase = createClient(supabaseUrl ?? '', supabaseKey ?? '', {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'implicit',
  },
})

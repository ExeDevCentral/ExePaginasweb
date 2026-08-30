import { createBrowserClient } from '@supabase/ssr'

const DEFAULT_SUPABASE_URL = 'https://bksonxnxshxinqffswqc.supabase.co'
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_NMmYBCHV_xhHpcPWDS2DLA_5lhUeGSb'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    DEFAULT_SUPABASE_ANON_KEY

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

// Singleton client for standard client components
export const supabase = createClient()

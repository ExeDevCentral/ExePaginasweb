import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

let cachedClient: SupabaseClient | null = null

function createClient(): SupabaseClient {
  if (cachedClient) return cachedClient

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Supabase browser client is not configured. Set NEXT_PUBLIC_SUPABASE_URL and a public key.'
    )
  }

  cachedClient = createBrowserClient(supabaseUrl, supabaseAnonKey)
  return cachedClient
}

export { createClient }

export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = createClient()
    const value = (client as unknown as Record<string, unknown>)[prop as string]
    return typeof value === 'function'
      ? (value as (...args: unknown[]) => unknown).bind(client)
      : value
  },
})

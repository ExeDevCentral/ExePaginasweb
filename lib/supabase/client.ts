/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

let cachedClient: SupabaseClient | null = null

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  return Boolean(url && key && url.trim() !== '' && key.trim() !== '')
}

function createClient(): SupabaseClient {
  if (cachedClient) return cachedClient

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

  if (!isSupabaseConfigured()) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        'Supabase browser client is not configured. Set NEXT_PUBLIC_SUPABASE_URL and a public key.'
      )
    }
    console.warn(
      '[Supabase Client] NEXT_PUBLIC_SUPABASE_URL o clave pública no configuradas. Usando cliente fallback en modo desarrollo.'
    )
    cachedClient = createBrowserClient(
      supabaseUrl?.trim() || 'https://bksonxnxshxinqffswqc.supabase.co',
      supabaseAnonKey?.trim() || 'sb_placeholder_anon_key'
    )
    return cachedClient
  }

  cachedClient = createBrowserClient(supabaseUrl!, supabaseAnonKey!)
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

export default supabase

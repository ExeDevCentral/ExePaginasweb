function _optionalChain(ops) {
  let lastAccessLHS = undefined
  let value = ops[0]
  let i = 1
  while (i < ops.length) {
    const op = ops[i]
    const fn = ops[i + 1]
    i += 2
    if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) {
      return undefined
    }
    if (op === 'access' || op === 'optionalAccess') {
      lastAccessLHS = value
      value = fn(value)
    } else if (op === 'call' || op === 'optionalCall') {
      value = fn((...args) => value.call(lastAccessLHS, ...args))
      lastAccessLHS = undefined
    }
  }
  return value
} /**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
import { createBrowserClient } from '@supabase/ssr'

let cachedClient = null

export function isSupabaseConfigured() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  return Boolean(url && key && url.trim() !== '' && key.trim() !== '')
}

function createClient() {
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
      _optionalChain([supabaseUrl, 'optionalAccess', (_) => _.trim, 'call', (_2) => _2()]) ||
        'https://bksonxnxshxinqffswqc.supabase.co',
      _optionalChain([supabaseAnonKey, 'optionalAccess', (_3) => _3.trim, 'call', (_4) => _4()]) ||
        'sb_placeholder_anon_key'
    )
    return cachedClient
  }

  cachedClient = createBrowserClient(supabaseUrl, supabaseAnonKey)
  return cachedClient
}

export { createClient }

export const supabase = new Proxy(
  {},
  {
    get(_target, prop) {
      const client = createClient()
      const value = client[prop]
      return typeof value === 'function' ? value.bind(client) : value
    },
  }
)

export default supabase

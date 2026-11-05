/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
import { isSupabaseAdminConfigured, supabaseAdmin } from '@/lib/supabase/admin'

export type RateLimitResult = {
  allowed: boolean
  retryAfterSeconds: number
}

type MemoryRateRecord = {
  timestamps: number[]
}
const memoryRateMap = new Map<string, MemoryRateRecord>()

function checkMemoryRateLimit(
  key: string,
  windowSeconds: number,
  maxRequests: number
): RateLimitResult {
  const now = Date.now()
  const windowMs = windowSeconds * 1000
  const record = memoryRateMap.get(key) || { timestamps: [] }
  record.timestamps = record.timestamps.filter((ts) => now - ts < windowMs)

  if (record.timestamps.length >= maxRequests) {
    const oldest = record.timestamps[0] ?? now
    const retryAfter = Math.max(1, Math.ceil((oldest + windowMs - now) / 1000))
    return { allowed: false, retryAfterSeconds: retryAfter }
  }

  record.timestamps.push(now)
  memoryRateMap.set(key, record)

  if (memoryRateMap.size > 5000) {
    for (const [k, v] of memoryRateMap.entries()) {
      const lastTs = v.timestamps[v.timestamps.length - 1]
      if (v.timestamps.length === 0 || (lastTs !== undefined && now - lastTs > windowMs)) {
        memoryRateMap.delete(k)
      }
    }
  }

  return { allowed: true, retryAfterSeconds: windowSeconds }
}

export async function checkRateLimit(
  key: string,
  windowSeconds: number,
  maxRequests: number
): Promise<RateLimitResult> {
  if (process.env.NODE_ENV === 'test') {
    return { allowed: true, retryAfterSeconds: windowSeconds }
  }

  if (isSupabaseAdminConfigured()) {
    try {
      const { data, error } = await supabaseAdmin.rpc('check_api_rate_limit', {
        p_key: key,
        p_window_seconds: windowSeconds,
        p_max_requests: maxRequests,
      })

      if (!error && data !== null && data !== undefined) {
        const result = Array.isArray(data) ? data[0] : data
        return {
          allowed: result?.allowed === true,
          retryAfterSeconds: Number(result?.retry_after_seconds ?? windowSeconds),
        }
      }
      if (error) {
        console.warn(
          `[rateLimit] Supabase RPC no disponible: ${error.message}. Usando limitador en memoria.`
        )
      }
    } catch (dbError) {
      console.warn(
        '[rateLimit] Error conectando con rate limiter de Supabase, activando fallback en memoria:',
        dbError
      )
    }
  }

  return checkMemoryRateLimit(key, windowSeconds, maxRequests)
}

export function clientIp(request: Request): string {
  const xVercel = request.headers.get('x-vercel-forwarded-for')
  if (xVercel) {
    const first = xVercel.split(',')[0]
    if (first) return first.trim()
  }

  const cfConnecting = request.headers.get('cf-connecting-ip')
  if (cfConnecting) return cfConnecting.trim()

  const xReal = request.headers.get('x-real-ip')
  if (xReal) return xReal.trim()

  const xForwarded = request.headers.get('x-forwarded-for')
  if (xForwarded) {
    const first = xForwarded.split(',')[0]
    if (first) return first.trim()
  }

  return 'unknown'
}

import { isSupabaseAdminConfigured, supabaseAdmin } from '@/lib/supabase/admin'

export type RateLimitResult = {
  allowed: boolean
  retryAfterSeconds: number
}

export async function checkRateLimit(
  key: string,
  windowSeconds: number,
  maxRequests: number
): Promise<RateLimitResult> {
  if (process.env.NODE_ENV === 'test') {
    return { allowed: true, retryAfterSeconds: windowSeconds }
  }

  if (!isSupabaseAdminConfigured()) {
    throw new Error('Rate limiting is not configured')
  }

  const { data, error } = await supabaseAdmin.rpc('check_api_rate_limit', {
    p_key: key,
    p_window_seconds: windowSeconds,
    p_max_requests: maxRequests,
  })

  if (error) throw error

  const result = Array.isArray(data) ? data[0] : data
  return {
    allowed: result?.allowed === true,
    retryAfterSeconds: Number(result?.retry_after_seconds ?? windowSeconds),
  }
}

export function clientIp(request: Request): string {
  return (
    request.headers.get('x-real-ip') ||
    request.headers.get('x-forwarded-for')?.split(',').at(-1)?.trim() ||
    'unknown'
  )
}

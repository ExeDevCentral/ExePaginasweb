/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
import { NextRequest, NextResponse } from 'next/server'
import { isSupabaseAdminConfigured, supabaseAdmin as supabase } from '@/lib/supabase/admin'
import { checkRateLimit, clientIp } from '@/lib/server/rateLimit'
import { validateFetchMetadata } from '@/lib/server/requestSecurity'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const fetchMeta = validateFetchMetadata(req)
  if (!fetchMeta.allowed && fetchMeta.errorResponse) {
    return fetchMeta.errorResponse
  }

  try {
    const limit = await checkRateLimit(`check-admin:${clientIp(req)}`, 60, 30)
    if (!limit.allowed) {
      return NextResponse.json(
        { admin: false, error: 'Demasiadas solicitudes.' },
        { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } }
      )
    }
  } catch (rateLimitError) {
    console.error('[check-admin] Rate limiter unavailable:', rateLimitError)
    return NextResponse.json({ error: 'Servicio temporalmente no disponible.' }, { status: 503 })
  }

  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json(
      { error: 'Admin authentication is not configured' },
      { status: 503, headers: { 'Cache-Control': 'private, no-store' } }
    )
  }

  const authHeader = req.headers.get('authorization')
  const token = authHeader?.match(/^Bearer\s+(.+)$/i)?.[1]?.trim()
  if (!token) {
    return NextResponse.json({ admin: false }, { status: 401 })
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token)
  if (error || !user) {
    return NextResponse.json({ admin: false }, { status: 401 })
  }

  const { data: role, error: roleError } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .maybeSingle()

  if (roleError) {
    return NextResponse.json({ error: 'Unable to verify role' }, { status: 503 })
  }

  const isAdmin = role?.role === 'admin'
  return NextResponse.json(
    { admin: isAdmin },
    { headers: { 'Cache-Control': 'private, no-store' } }
  )
}

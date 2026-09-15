/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin as db } from '@/lib/supabase/admin'

type AuthUser = { id: string; email: string; user_metadata?: Record<string, unknown> }

export function getBearerToken(req: NextRequest): string | null {
  const value = req.headers.get('authorization')
  const match = value?.match(/^Bearer\s+(.+)$/i)
  return match?.[1]?.trim() || null
}

export async function requireAuthUser(
  req: NextRequest
): Promise<{ user: AuthUser | null; error: NextResponse | null }> {
  const accessToken = getBearerToken(req)
  if (!accessToken) {
    return {
      user: null,
      error: NextResponse.json({ error: 'Autenticación requerida.' }, { status: 401 }),
    }
  }

  const { data, error } = await db.auth.getUser(accessToken)
  if (error || !data?.user?.id || !data.user.email) {
    return {
      user: null,
      error: NextResponse.json({ error: 'Sesión inválida o expirada.' }, { status: 401 }),
    }
  }

  return {
    user: {
      id: data.user.id,
      email: data.user.email,
      user_metadata:
        typeof data.user.user_metadata === 'object' && data.user.user_metadata !== null
          ? (data.user.user_metadata as Record<string, unknown>)
          : {},
    },
    error: null,
  }
}

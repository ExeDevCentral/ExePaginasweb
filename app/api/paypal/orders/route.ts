/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { isSupabaseAdminConfigured } from '@/lib/supabase/admin'
import { createPayPalOrder } from '@/lib/server/paypal'
import { requireAuthUser } from '@/lib/server/apiAuth'
import { checkRateLimit, clientIp } from '@/lib/server/rateLimit'
import { STORE_PLAN_IDS } from '@/core/domain/planCatalog'

export const dynamic = 'force-dynamic'

const CreateOrderSchema = z.object({
  planSlug: z.enum(STORE_PLAN_IDS),
  tipoProyecto: z.string().trim().max(50).default('mantenimiento'),
})

export async function POST(req: NextRequest) {
  try {
    const limit = await checkRateLimit(`paypal-order:${clientIp(req)}`, 3_600, 20)
    if (!limit.allowed) {
      return NextResponse.json(
        { error: 'Demasiadas solicitudes. Intenta más tarde.' },
        { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } }
      )
    }
  } catch (rateLimitError) {
    console.error('[paypal/orders] Rate limiter unavailable:', rateLimitError)
    return NextResponse.json({ error: 'Servicio temporalmente no disponible.' }, { status: 503 })
  }

  let body: unknown = null
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const parseResult = CreateOrderSchema.safeParse(body)
  if (!parseResult.success) {
    return NextResponse.json(
      { error: 'Faltan campos requeridos o son inválidos.', details: parseResult.error.flatten() },
      { status: 400 }
    )
  }

  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
  }

  const { user, error: authError } = await requireAuthUser(req)
  if (authError || !user) {
    return authError ?? NextResponse.json({ error: 'Autenticación requerida.' }, { status: 401 })
  }

  const { planSlug, tipoProyecto } = parseResult.data
  const result = await createPayPalOrder({
    planSlug,
    email: user.email,
    tipoProyecto,
  })

  if (!result.ok) {
    console.error('[paypal/orders] create order failed:', result.error)
    return NextResponse.json({ error: 'No se pudo iniciar el pago con PayPal.' }, { status: 502 })
  }

  return NextResponse.json({ ok: true, id: result.orderId })
}

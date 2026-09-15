/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { isSupabaseAdminConfigured } from '@/lib/supabase/admin'
import {
  capturePayPalOrder,
  fetchPayPalOrder,
  getPayPalAccessToken,
  processPayPalCapture,
  type PayPalCapturedOrder,
} from '@/lib/server/paypal'
import { requireAuthUser } from '@/lib/server/apiAuth'
import { checkRateLimit, clientIp } from '@/lib/server/rateLimit'

export const dynamic = 'force-dynamic'

const CaptureOrderSchema = z.object({
  orderId: z.string().trim().min(1).max(64),
})

export async function POST(req: NextRequest) {
  try {
    const limit = await checkRateLimit(`paypal-capture:${clientIp(req)}`, 3_600, 30)
    if (!limit.allowed) {
      return NextResponse.json(
        { error: 'Demasiadas solicitudes. Intenta más tarde.' },
        { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } }
      )
    }
  } catch (rateLimitError) {
    console.error('[paypal/capture] Rate limiter unavailable:', rateLimitError)
    return NextResponse.json({ error: 'Servicio temporalmente no disponible.' }, { status: 503 })
  }

  let body: unknown = null
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const parseResult = CaptureOrderSchema.safeParse(body)
  if (!parseResult.success) {
    return NextResponse.json(
      { error: 'Falta el ID de la orden de PayPal.', details: parseResult.error.flatten() },
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

  const { orderId } = parseResult.data
  const token = await getPayPalAccessToken()
  if (!token) {
    return NextResponse.json({ error: 'PayPal credentials are not configured' }, { status: 502 })
  }

  const captureResult = await capturePayPalOrder(orderId, token)
  let captured: PayPalCapturedOrder | null = null

  if (captureResult.ok) {
    captured = captureResult.order
  } else if (captureResult.alreadyCaptured) {
    console.log('[paypal/capture] order already captured, fetching details:', orderId)
    captured = await fetchPayPalOrder(orderId, token)
  } else {
    console.error('[paypal/capture] capture failed:', captureResult.status, captureResult.error)
    return NextResponse.json({ error: 'No se pudo confirmar el pago.' }, { status: 502 })
  }

  if (captured?.status !== 'COMPLETED') {
    console.error('[paypal/capture] order not completed:', orderId)
    return NextResponse.json({ error: 'La orden no fue completada.' }, { status: 400 })
  }

  const result = await processPayPalCapture(captured)
  if (!result.ok) {
    console.error('[paypal/capture] processing failed:', result.error)
    return NextResponse.json({ error: 'No se pudo registrar el pago.' }, { status: 502 })
  }

  return NextResponse.json({
    ok: true,
    duplicate: result.duplicate,
    pagoId: result.pagoId,
    planSlug: result.planSlug,
    tenantId: result.tenantId,
  })
}

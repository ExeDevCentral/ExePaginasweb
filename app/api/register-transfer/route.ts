import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { isSupabaseAdminConfigured, supabaseAdmin as db } from '@/lib/supabase/admin'
import { checkRateLimit, clientIp } from '@/lib/server/rateLimit'

const PLAN_MONTOS_ARS: Record<string, number> = {
  'mantenimiento-basico': 25000,
  'mantenimiento-avanzado': 50000,
  'mantenimiento-premium': 150000,
}

const RegisterTransferSchema = z.object({
  email: z.string().trim().email().max(255),
  fullName: z.string().trim().max(100).nullish(),
  planSlug: z.enum(['mantenimiento-basico', 'mantenimiento-avanzado', 'mantenimiento-premium']),
  planNombre: z.string().trim().max(100).nullish(),
  tipoProyecto: z.string().trim().max(50).nullish(),
})

async function getOrCreateCliente(
  authUserId: string,
  email: string,
  fullName?: string | null
): Promise<string> {
  const { data: existente, error: lookupError } = await db
    .from('clientes')
    .select('id')
    .eq('id', authUserId)
    .maybeSingle()

  if (lookupError) throw lookupError
  if (existente?.id) return existente.id

  const { data: nuevo, error: insertError } = await db
    .from('clientes')
    .insert({ id: authUserId, email, full_name: fullName || null })
    .select('id')
    .single()

  if (insertError) throw insertError
  if (!nuevo?.id) throw new Error('Cliente no pudo ser creado')
  return nuevo.id
}

function getBearerToken(req: NextRequest): string | null {
  const value = req.headers.get('authorization')
  const match = value?.match(/^Bearer\s+(.+)$/i)
  return match?.[1]?.trim() || null
}

export async function POST(req: NextRequest) {
  try {
    const limit = await checkRateLimit(`register-transfer:${clientIp(req)}`, 3_600, 10)
    if (!limit.allowed) {
      return NextResponse.json(
        { error: 'Demasiadas solicitudes. Intenta más tarde.' },
        { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } }
      )
    }
  } catch (rateLimitError) {
    console.error('[register-transfer] Rate limiter unavailable:', rateLimitError)
    return NextResponse.json({ error: 'Servicio temporalmente no disponible.' }, { status: 503 })
  }

  let body: unknown = null
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const parseResult = RegisterTransferSchema.safeParse(body)
  if (!parseResult.success) {
    return NextResponse.json(
      { error: 'Faltan campos requeridos o son inválidos.', details: parseResult.error.flatten() },
      { status: 400 }
    )
  }

  const { email, fullName, planSlug, planNombre, tipoProyecto } = parseResult.data
  const idempotencyKey = req.headers.get('idempotency-key')?.trim()

  if (!idempotencyKey || idempotencyKey.length < 16 || idempotencyKey.length > 128) {
    return NextResponse.json({ error: 'Falta una clave de idempotencia válida.' }, { status: 400 })
  }

  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
  }

  try {
    const accessToken = getBearerToken(req)
    if (!accessToken) {
      return NextResponse.json({ error: 'Autenticación requerida.' }, { status: 401 })
    }

    const {
      data: { user },
      error: authError,
    } = await db.auth.getUser(accessToken)

    if (authError || !user?.id || !user.email) {
      return NextResponse.json({ error: 'Sesión inválida o expirada.' }, { status: 401 })
    }

    if (email.toLowerCase() !== user.email.toLowerCase()) {
      return NextResponse.json(
        { error: 'El email debe coincidir con la cuenta autenticada.' },
        { status: 403 }
      )
    }

    const authenticatedName =
      typeof user.user_metadata?.full_name === 'string' ? user.user_metadata.full_name : fullName
    const clienteId = await getOrCreateCliente(user.id, user.email, authenticatedName || null)

    const { data: existingPayment, error: existingPaymentError } = await db
      .from('pagos')
      .select('id, monto, moneda, estado, created_at')
      .eq('cliente_id', clienteId)
      .eq('provider', 'transferencia')
      .eq('idempotency_key', idempotencyKey)
      .maybeSingle()

    if (existingPaymentError) throw existingPaymentError
    if (existingPayment) {
      return NextResponse.json({ ok: true, pagoId: existingPayment.id, duplicate: true })
    }

    const monto = PLAN_MONTOS_ARS[planSlug]
    if (!monto) {
      return NextResponse.json({ error: `Plan desconocido: ${planSlug}` }, { status: 400 })
    }

    const { data: pago, error: pagoError } = await db
      .from('pagos')
      .insert({
        cliente_id: clienteId,
        monto,
        moneda: 'ARS',
        estado: 'pendiente',
        plan_nombre: planNombre || null,
        plan_slug: planSlug,
        tipo_proyecto: tipoProyecto || 'mantenimiento',
        provider: 'transferencia',
        idempotency_key: idempotencyKey,
      })
      .select('id, monto, moneda, estado, created_at')
      .single()

    if (pagoError) {
      console.error('[register-transfer] Error inserting pago:', pagoError)
      return NextResponse.json({ error: 'No se pudo registrar la transferencia.' }, { status: 500 })
    }

    console.log(`[register-transfer] Transferencia pendiente registrada para ${email}:`, pago.id)
    return NextResponse.json({ ok: true, pagoId: pago.id })
  } catch (err) {
    console.error('[register-transfer] Error:', err)
    return NextResponse.json({ error: 'Error al registrar la transferencia.' }, { status: 500 })
  }
}

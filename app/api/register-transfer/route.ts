import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { supabaseAdmin as db } from '@/lib/supabase/admin'

const PLAN_MONTOS_ARS: Record<string, number> = {
  'mantenimiento-basico': 25000,
  'mantenimiento-avanzado': 50000,
  'mantenimiento-premium': 150000,
}

const RATE_LIMIT_WINDOW_MS = 3_600_000
const RATE_LIMIT_MAX_REQUESTS = 10
const requestLog = new Map<string, number[]>()

const RegisterTransferSchema = z.object({
  email: z.string().trim().email().max(255),
  fullName: z.string().trim().max(100).nullish(),
  planSlug: z.enum(['mantenimiento-basico', 'mantenimiento-avanzado', 'mantenimiento-premium']),
  planNombre: z.string().trim().max(100).nullish(),
  tipoProyecto: z.string().trim().max(50).nullish(),
})

function getClientIp(req: NextRequest): string {
  const forwardedFor = req.headers.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }
  return req.headers.get('x-real-ip') ?? 'unknown'
}

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const previous = requestLog.get(ip) ?? []
  const recent = previous.filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS)
  if (recent.length >= RATE_LIMIT_MAX_REQUESTS) {
    requestLog.set(ip, recent)
    return true
  }
  recent.push(now)
  requestLog.set(ip, recent)
  return false
}

async function getOrCreateCliente(email: string, fullName?: string | null): Promise<string | null> {
  if (!db) return null

  const { data: existentes } = await db.from('clientes').select('id').eq('email', email).limit(1)
  if (existentes?.[0]) return existentes[0].id

  let id: string | null = null
  try {
    const { data: authUser } = await db.auth.admin.listUsers()
    const match = authUser?.users?.find((u) => u.email?.toLowerCase() === email?.toLowerCase())
    id = match?.id || null
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unknown auth error'
    console.warn('[register-transfer] No se pudo buscar en auth.users:', msg)
  }

  if (!id) return null

  const { data: nuevo } = await db
    .from('clientes')
    .insert({ id, email, full_name: fullName || null })
    .select('id')
    .single()

  return nuevo?.id || id
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req)
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Demasiadas solicitudes. Intenta más tarde.' },
      { status: 429 }
    )
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

  if (!db) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
  }

  try {
    const clienteId = await getOrCreateCliente(email, fullName || null)
    if (!clienteId) {
      return NextResponse.json(
        { error: 'No existe una cuenta registrada con ese email. Creá una cuenta primero.' },
        { status: 400 }
      )
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
      })
      .select('id, monto, moneda, estado, created_at')
      .single()

    if (pagoError) {
      console.error('[register-transfer] Error inserting pago:', pagoError)
      return NextResponse.json({ error: pagoError.message }, { status: 500 })
    }

    console.log(`[register-transfer] Transferencia pendiente registrada para ${email}:`, pago.id)
    return NextResponse.json({ ok: true, pagoId: pago.id })
  } catch (err) {
    console.error('[register-transfer] Error:', err)
    return NextResponse.json({ error: 'Error al registrar la transferencia.' }, { status: 500 })
  }
}

/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { isSupabaseAdminConfigured, supabaseAdmin as db } from '@/lib/supabase/admin'
import { checkRateLimit, clientIp } from '@/lib/server/rateLimit'
import { requireAuthUser } from '@/lib/server/apiAuth'
import { readJsonBody, validateFetchMetadata } from '@/lib/server/requestSecurity'

export const dynamic = 'force-dynamic'

const SubmitComprobanteSchema = z.object({
  pagoId: z.string().uuid().optional().nullable(),
  numeroOperacion: z.string().trim().max(100).optional().nullable(),
  bancoOrigen: z.string().trim().max(100).optional().nullable(),
  notas: z.string().trim().max(500).optional().nullable(),
  fileName: z.string().trim().max(255).optional().nullable(),
})

type TargetPago = {
  id: string
  plan_nombre: string | null
  plan_slug: string | null
  detalles: Record<string, unknown> | null
}

export async function POST(req: NextRequest) {
  const fetchMeta = validateFetchMetadata(req)
  if (!fetchMeta.allowed && fetchMeta.errorResponse) {
    return fetchMeta.errorResponse
  }

  try {
    const limit = await checkRateLimit(`submit-comprobante:${clientIp(req)}`, 3_600, 20)
    if (!limit.allowed) {
      return NextResponse.json(
        { error: 'Demasiadas solicitudes. Intenta más tarde.' },
        { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } }
      )
    }
  } catch (rateLimitError) {
    console.error('[submit-comprobante] Rate limiter unavailable:', rateLimitError)
    return NextResponse.json({ error: 'Servicio temporalmente no disponible.' }, { status: 503 })
  }

  const bodyResult = await readJsonBody(req, 10 * 1024)
  if (bodyResult.errorResponse) return bodyResult.errorResponse

  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json({ error: 'Supabase no configurado' }, { status: 500 })
  }

  const { user, error: authError } = await requireAuthUser(req)
  if (authError || !user) {
    return authError ?? NextResponse.json({ error: 'Autenticación requerida.' }, { status: 401 })
  }

  const parseResult = SubmitComprobanteSchema.safeParse(bodyResult.body)
  if (!parseResult.success) {
    return NextResponse.json(
      { error: 'Datos inválidos.', details: parseResult.error.flatten() },
      { status: 400 }
    )
  }

  const { pagoId, numeroOperacion, bancoOrigen, notas, fileName } = parseResult.data

  try {
    let targetPago: TargetPago | null = null

    if (pagoId) {
      const { data, error } = await db
        .from('pagos')
        .select('id, plan_nombre, plan_slug, detalles')
        .eq('id', pagoId)
        .eq('cliente_id', user.id)
        .maybeSingle()
      if (error) throw error
      if (data) targetPago = data as unknown as TargetPago
    }

    if (!targetPago && pagoId) {
      return NextResponse.json(
        { error: 'El pago seleccionado no pertenece a tu cuenta.' },
        { status: 404 }
      )
    }

    if (!targetPago) {
      const { data, error } = await db
        .from('pagos')
        .select('id, plan_nombre, plan_slug, detalles')
        .eq('cliente_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()
      if (error) throw error
      if (data) targetPago = data as unknown as TargetPago
    }

    const fechaStr = new Date().toISOString()
    const comprobanteInfo = {
      numeroOperacion: numeroOperacion || 'Sin especificar',
      bancoOrigen: bancoOrigen || 'No indicado',
      notas: notas || '',
      fileName: fileName || 'Comprobante',
      fecha: fechaStr,
    }

    if (targetPago) {
      const existingDetalles =
        typeof targetPago.detalles === 'object' && targetPago.detalles !== null
          ? targetPago.detalles
          : {}

      const { error } = await db
        .from('pagos')
        .update({
          detalles: {
            ...existingDetalles,
            comprobante: comprobanteInfo,
          },
        })
        .eq('id', targetPago.id)
      if (error) throw error
    }

    const planName = targetPago?.plan_nombre || 'Abono de Servicios'
    const planSlug = targetPago?.plan_slug || null

    const { error: ticketError } = await db.from('tickets').insert({
      cliente_id: user.id,
      asunto: `Comprobante de pago: ${planName}`,
      mensaje: `El cliente adjuntó datos del comprobante de transferencia.\n• Plan: ${planName}\n• Operación: ${numeroOperacion || 'N/A'}\n• Entidad/Banco: ${bancoOrigen || 'N/A'}\n• Archivo: ${fileName || 'Sin archivo adjunto'}\n• Notas: ${notas || 'Ninguna'}`,
      categoria: 'facturacion',
      prioridad: 'alta',
      estado: 'abierto',
      plan_slug: planSlug,
    })
    if (ticketError) throw ticketError

    return NextResponse.json({
      ok: true,
      message: 'Comprobante registrado con éxito. En breve será verificado.',
      pagoId: targetPago?.id,
    })
  } catch (err) {
    console.error('[submit-comprobante] Error:', err)
    return NextResponse.json({ error: 'Error al procesar el comprobante.' }, { status: 500 })
  }
}

/**
 * © 2025 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Endpoint para disparar automatizaciones en vivo con n8n Cloud.
 */
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { dispatchN8nEvent } from '@/lib/server/n8n'
import { checkRateLimit, clientIp } from '@/lib/server/rateLimit'

const AutomationRequestSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(100),
  email: z.string().email().max(255).nullish(),
  automationType: z.enum([
    'cotizacion_express',
    'auditoria_gratis',
    'demo_sistema',
    'notificacion_directa',
  ]),
  details: z.string().max(500).nullish(),
})

export async function POST(req) {
  const ip = clientIp(req)
  try {
    const rl = await checkRateLimit(`n8n-automation:${ip}`, 60, 20)
    if (!rl.allowed) {
      return NextResponse.json(
        { error: 'Demasiadas solicitudes. Por favor, aguarda un momento.' },
        { status: 429, headers: { 'Retry-After': String(rl.retryAfterSeconds) } }
      )
    }
  } catch {
    // Si Supabase admin no está configurado o falla, continuar tolerante
  }

  let body
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const parsed = AutomationRequestSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Datos inválidos', details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const { name, email, automationType, details } = parsed.data
  const ticketId = `EXE-N8N-${Date.now().toString(36).toUpperCase().slice(-5)}`

  const dispatchResult = await dispatchN8nEvent({
    event: 'automation.trigger',
    ticketId,
    name,
    email: email || undefined,
    message: details || `Solicitud de automatización: ${automationType}`,
    metadata: {
      automationType,
      source: 'web_interactive_trigger',
    },
  })

  return NextResponse.json({
    ok: true,
    ticketId,
    automationType,
    clientName: name,
    dispatchedToN8n: dispatchResult.sent,
    message: `¡Automatización n8n ejecutada con éxito para ${name}! Ticket [${ticketId}].`,
  })
}

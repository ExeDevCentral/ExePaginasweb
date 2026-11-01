/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Endpoint para disparar y diagnosticar automatizaciones en vivo con n8n Cloud y Resend.
 */
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { dispatchN8nEvent } from '@/lib/server/n8n'
import { checkRateLimit, clientIp } from '@/lib/server/rateLimit'
import { sendEmail } from '@/lib/email/send'
import { n8nAutomationReceipt } from '@/lib/email/templates'
import { readJsonBody } from '@/lib/server/requestSecurity'

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

/** Public health response deliberately reveals no provider configuration or status. */
export async function GET() {
  return NextResponse.json({ status: 'ok' }, { headers: { 'Cache-Control': 'no-store' } })
}

export async function POST(req: NextRequest) {
  const ip = clientIp(req)
  try {
    const rl = await checkRateLimit(`n8n-automation:${ip}`, 60, 20)
    if (!rl.allowed) {
      return NextResponse.json(
        { error: 'Demasiadas solicitudes. Por favor, aguarda un momento.' },
        { status: 429, headers: { 'Retry-After': String(rl.retryAfterSeconds) } }
      )
    }
  } catch (rateLimitError) {
    console.error('[automation/n8n] Rate limiter unavailable:', rateLimitError)
    return NextResponse.json({ error: 'Servicio temporalmente no disponible.' }, { status: 503 })
  }

  const bodyResult = await readJsonBody(req, 10 * 1024)
  if (bodyResult.errorResponse) return bodyResult.errorResponse
  const body: unknown = bodyResult.body

  const parsed = AutomationRequestSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Datos inválidos', details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const { name, email, automationType, details } = parsed.data
  const ticketId = `EXE-N8N-${Date.now().toString(36).toUpperCase().slice(-5)}`

  // 1. Despachar a n8n
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

  // 2. Si el usuario ingresó email, enviar comprobante instantáneo vía Resend
  let emailSent = false
  if (email && process.env.RESEND_API_KEY) {
    try {
      await sendEmail({
        to: email,
        subject: `⚡ Tu automatización [${ticketId}] fue ejecutada — ExeSistemasWEB`,
        html: n8nAutomationReceipt({
          name,
          email,
          automationType,
          details: details || undefined,
          ticketId,
          engineMode: dispatchResult.sent ? 'n8n_cloud' : 'serverless_free',
          lang: 'es',
        }),
      })
      emailSent = true
    } catch (emailErr) {
      console.warn('[automation-api] No se pudo enviar email de confirmación:', emailErr)
    }
  }

  return NextResponse.json({
    ok: true,
    ticketId,
    automationType,
    clientName: name,
    clientEmail: email || null,
    dispatchedToN8n: dispatchResult.sent,
    emailConfirmationSent: emailSent,
    engine: dispatchResult.sent ? 'n8n_cloud' : 'serverless_free',
    pipeline: [
      { step: 'webhook_ingest', ok: true },
      { step: 'n8n_dispatch', ok: dispatchResult.sent },
      { step: 'resend_receipt', ok: emailSent || !email },
      { step: 'ticket_active', ok: true },
    ],
    message: `¡Automatización n8n ejecutada con éxito para ${name}! Ticket [${ticketId}].`,
  })
}

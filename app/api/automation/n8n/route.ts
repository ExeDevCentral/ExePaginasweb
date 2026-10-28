/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Endpoint para disparar y diagnosticar automatizaciones en vivo con n8n Cloud y Resend.
 */
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { dispatchN8nEvent } from '@/lib/server/n8n'
import { checkRateLimit, clientIp } from '@/lib/server/rateLimit'
import { sendEmail, ensureResendWebhooksActive } from '@/lib/email/send'
import { n8nAutomationReceipt } from '@/lib/email/templates'

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

/**
 * Health & Keep-Alive Ping (GET):
 * Mantiene despierto el webhook en instancias gratuitas de n8n,
 * auto-reactiva webhooks de Resend y reporta el estado general del stack.
 */
export async function GET() {
  const webhookUrl = process.env.N8N_WEBHOOK_URL?.trim()
  const started = performance.now()
  let n8nStatus = 'unconfigured'
  let n8nLatency = 0

  if (webhookUrl) {
    try {
      const pingPayload = {
        event: 'ping.keepalive',
        timestamp: new Date().toISOString(),
        source: 'health_check',
      }
      const pingRes = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pingPayload),
        signal: AbortSignal.timeout(4000),
      })
      n8nLatency = Math.round(performance.now() - started)
      n8nStatus = pingRes.ok ? 'active' : `status_${pingRes.status}`
    } catch (err) {
      n8nLatency = Math.round(performance.now() - started)
      n8nStatus = `unreachable: ${err instanceof Error ? err.message : String(err)}`
    }
  }

  const resendHealth = await ensureResendWebhooksActive()

  return NextResponse.json({
    status: 'ok',
    mode: 'free_tier_resilient',
    n8n: {
      status: n8nStatus,
      latencyMs: n8nLatency,
      configured: Boolean(webhookUrl),
    },
    resend: resendHealth,
    timestamp: new Date().toISOString(),
  })
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
  } catch {
    // Si Supabase admin no está configurado o falla, continuar tolerante
  }

  let body: unknown
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

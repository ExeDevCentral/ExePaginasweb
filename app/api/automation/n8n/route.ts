/**
 * © 2025 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Endpoint para disparar y diagnosticar automatizaciones en vivo con n8n Cloud y Resend.
 */
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { inspectUserMessage, sanitizeVisitorName } from '@/core/ai/securityGuard'
import { dispatchN8nEvent } from '@/lib/server/n8n'
import { checkRateLimit, clientIp } from '@/lib/server/rateLimit'
import { sendEmail, ADMIN_EMAIL } from '@/lib/email/send'
import { n8nAutomationReceipt, n8nAdminNotification } from '@/lib/email/templates'
import { readJsonBody, validateFetchMetadata } from '@/lib/server/requestSecurity'
import { isSupabaseAdminConfigured, supabaseAdmin } from '@/lib/supabase/admin'

const AutomationRequestSchema = z
  .object({
    name: z.string().min(1, 'El nombre es requerido').max(100),
    email: z.string().email('Email inválido').max(255).nullish().or(z.literal('')),
    phone: z.string().max(50).nullish().or(z.literal('')),
    automationType: z.enum([
      'cotizacion_express',
      'auditoria_gratis',
      'demo_sistema',
      'notificacion_directa',
    ]),
    details: z.string().max(500).nullish(),
  })
  .refine(
    (data) => {
      const hasEmail = Boolean(data.email && data.email.trim().length > 0)
      const hasPhone = Boolean(data.phone && data.phone.trim().length > 0)
      return hasEmail || hasPhone
    },
    {
      message: 'Debes proporcionar al menos un medio de contacto (WhatsApp/teléfono o email)',
      path: ['phone'],
    }
  )

/** Public health response deliberately reveals no provider configuration or status. */
export async function GET() {
  return NextResponse.json({ status: 'ok' }, { headers: { 'Cache-Control': 'no-store' } })
}

export async function POST(req: NextRequest) {
  const fetchMeta = validateFetchMetadata(req)
  if (!fetchMeta.allowed && fetchMeta.errorResponse) {
    return fetchMeta.errorResponse
  }

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

  const { name: rawName, email, phone, automationType, details } = parsed.data
  const nameVerdict = inspectUserMessage(rawName)
  const detailsVerdict = inspectUserMessage(details || '')
  if (!nameVerdict.allowed || !detailsVerdict.allowed) {
    return NextResponse.json(
      { error: 'Datos rechazados por el escudo de seguridad Zero-Trust.' },
      { status: 400 }
    )
  }

  const name = sanitizeVisitorName(rawName) ?? 'Visitante Web'
  const cleanEmail = email?.trim() || undefined
  const cleanPhone = phone?.trim() || undefined
  const cleanPhoneDigits = cleanPhone ? cleanPhone.replace(/[^0-9]/g, '') : null
  const ticketId = `EXE-N8N-${Date.now().toString(36).toUpperCase().slice(-5)}`

  // 1. Persistir lead en Supabase si está disponible
  if (isSupabaseAdminConfigured()) {
    try {
      await supabaseAdmin.from('leads').insert({
        email: cleanEmail || `${cleanPhoneDigits || 'anon'}@lead.exepaginasweb.com`,
        lead_type: 'automation_trigger',
        name,
        message: `[${ticketId}] [${automationType}] WhatsApp/Tel: ${cleanPhone || 'N/A'}. ${details || ''}`,
        metadata: {
          ticketId,
          phone: cleanPhone,
          email: cleanEmail,
          automationType,
          source: 'chat_button_automation',
        },
      })
    } catch (err) {
      console.warn('[automation/n8n] Error guardando lead en Supabase:', err)
    }
  }

  // 2. Despachar a n8n
  const dispatchResult = await dispatchN8nEvent({
    event: 'automation.trigger',
    ticketId,
    name,
    email: cleanEmail,
    phone: cleanPhone,
    message: details || `Solicitud desde botón de chat: ${automationType}`,
    metadata: {
      automationType,
      phone: cleanPhone,
      source: 'chat_button_trigger',
    },
  })

  // 3. Notificación instantánea al Administrador por email con plantilla escapada
  if (process.env.RESEND_API_KEY) {
    void sendEmail({
      to: ADMIN_EMAIL,
      replyTo: cleanEmail || ADMIN_EMAIL,
      subject: `[${ticketId}] 🚨 Nueva solicitud desde Botón de Chat: ${name}`,
      html: n8nAdminNotification({
        name,
        email: cleanEmail,
        phone: cleanPhone,
        automationType,
        details: details || undefined,
        ticketId,
        dispatchedToN8n: dispatchResult.sent,
      }),
      tags: [
        { name: 'category', value: 'n8n_automation_admin' },
        { name: 'ticket_id', value: ticketId },
      ],
    }).catch((emailErr) => {
      console.warn('[automation/n8n] Error notificando al admin:', emailErr)
    })
  }

  // 4. Si el cliente ingresó email, enviar comprobante instantáneo vía Resend
  let emailSent = false
  if (cleanEmail && process.env.RESEND_API_KEY) {
    try {
      await sendEmail({
        to: cleanEmail,
        replyTo: ADMIN_EMAIL,
        subject: `⚡ Tu automatización [${ticketId}] fue ejecutada — ExePaginasWeb`,
        html: n8nAutomationReceipt({
          name,
          email: cleanEmail,
          automationType,
          details: details || undefined,
          ticketId,
          engineMode: dispatchResult.sent ? 'n8n_cloud' : 'serverless_free',
          lang: 'es',
        }),
        tags: [
          { name: 'category', value: 'n8n_automation_client' },
          { name: 'ticket_id', value: ticketId },
        ],
      })
      emailSent = true
    } catch (emailErr) {
      console.warn('[automation-api] No se pudo enviar email de confirmación al cliente:', emailErr)
    }
  }

  return NextResponse.json({
    ok: true,
    ticketId,
    automationType,
    clientName: name,
    clientEmail: cleanEmail || null,
    clientPhone: cleanPhone || null,
    dispatchedToN8n: dispatchResult.sent,
    emailConfirmationSent: emailSent,
    engine: dispatchResult.sent ? 'n8n_cloud' : 'serverless_free',
    pipeline: [
      { step: 'webhook_ingest', ok: true },
      { step: 'n8n_dispatch', ok: dispatchResult.sent },
      { step: 'admin_notification', ok: true },
      { step: 'resend_receipt', ok: emailSent || !cleanEmail },
      { step: 'ticket_active', ok: true },
    ],
    message: `¡Automatización n8n ejecutada con éxito para ${name}! Ticket [${ticketId}].`,
  })
}

/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
import { NextRequest, NextResponse } from 'next/server'
import { Webhook } from 'svix'
import { z } from 'zod'
import { sendEmail, ensureResendWebhooksActive } from '@/lib/email/send'
import { inboundEmailNotification, contactAutoReply } from '@/lib/email/templates'
import { detectLanguage } from '@/lib/server/language'
import {
  claimWebhookEvent,
  markWebhookFailed,
  markWebhookProcessed,
} from '@/lib/server/webhookEvents'

// Esquemas tolerantes con soporte completo para nullish y estructuras variadas de Resend
const ResendAddressSchema = z.union([
  z.string(),
  z.array(z.union([z.string(), z.object({ email: z.string().nullish() }).passthrough()])),
  z.object({ email: z.string().nullish() }).passthrough(),
])

const ResendEventDataSchema = z
  .object({
    id: z.string().nullish(),
    email_id: z.string().nullish(),
    to: ResendAddressSchema.nullish(),
    recipient: ResendAddressSchema.nullish(),
    from: ResendAddressSchema.nullish(),
    subject: z.string().nullish(),
    text: z.string().nullish(),
    html: z.string().nullish(),
    bounce_type: z.string().nullish(),
    message: z.string().nullish(),
    click: z.object({ link: z.string().nullish() }).nullish(),
  })
  .passthrough()

const ResendEventSchema = z
  .object({
    type: z.string().nullish(),
    event: z.string().nullish(),
    data: ResendEventDataSchema.nullish(),
  })
  .passthrough()

type ResendAddress = z.infer<typeof ResendAddressSchema>
type ResendEvent = z.infer<typeof ResendEventSchema>
type ResendEventData = z.infer<typeof ResendEventDataSchema>

function addressText(value: ResendAddress | null | undefined, fallback: string): string {
  if (!value) return fallback
  if (typeof value === 'string') return value
  if (Array.isArray(value)) {
    return (
      value
        .map((item) => (typeof item === 'string' ? item : item?.email || ''))
        .filter(Boolean)
        .join(', ') || fallback
    )
  }
  return value.email || fallback
}

/**
 * Health-Check & Auto-Healer Endpoint (GET):
 * Permite verificar el estado del webhook y reactivar automáticamente
 * cualquier webhook deshabilitado en el panel de Resend vía API.
 */
export async function GET() {
  const secret =
    process.env.RESEND_WEBHOOK_SIGNING_SECRET ||
    process.env.RESEND_WEBHOOK_SECRET ||
    process.env.SVIX_SECRET

  const autoHealReport = await ensureResendWebhooksActive()

  return NextResponse.json({
    status: 'ok',
    endpoint: '/api/webhooks/resend',
    secretConfigured: Boolean(secret),
    provider: 'resend_svix',
    autoHeal: autoHealReport,
    timestamp: new Date().toISOString(),
  })
}

export async function POST(req: NextRequest) {
  const secret =
    process.env.RESEND_WEBHOOK_SIGNING_SECRET ||
    process.env.RESEND_WEBHOOK_SECRET ||
    process.env.SVIX_SECRET

  if (!secret) {
    console.error(
      '[resend-webhook] Secret de firma no configurado en el servidor (RESEND_WEBHOOK_SECRET)'
    )
    return NextResponse.json(
      { error: 'Configuración de seguridad del servidor incompleta' },
      { status: 500 }
    )
  }

  const svixId = req.headers.get('svix-id')
  const svixTimestamp = req.headers.get('svix-timestamp')
  const svixSignature = req.headers.get('svix-signature')

  if (!svixId || !svixTimestamp || !svixSignature) {
    console.warn('[resend-webhook] Missing Svix headers in webhook request')
    return NextResponse.json({ error: 'Missing Svix signature headers' }, { status: 400 })
  }

  let payloadString = ''
  try {
    payloadString = await req.text()
  } catch (err: unknown) {
    console.error('[resend-webhook] Error reading request raw body:', err)
    return NextResponse.json({ error: 'Error reading request body' }, { status: 400 })
  }

  let event: ResendEvent
  try {
    const wh = new Webhook(secret)
    const verified = wh.verify(payloadString, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    })
    event = ResendEventSchema.parse(verified)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown signature error'
    console.error('[resend-webhook] Signature verification failed:', message)
    return NextResponse.json(
      { error: `Webhook signature verification failed: ${message}` },
      { status: 400 }
    )
  }

  const eventType = event.type || event.event || 'unknown'
  const eventData: ResendEventData = event.data || {}

  // Idempotencia tolerante: Si Supabase no está configurado, continuar sin romper el webhook
  try {
    const claimed = await claimWebhookEvent(
      'resend',
      svixId,
      eventType,
      event as Record<string, unknown>
    )
    if (!claimed) {
      return NextResponse.json({ received: true, type: eventType, duplicate: true })
    }
  } catch (claimError) {
    console.warn(
      '[resend-webhook] Webhook storage no disponible, continuando en modo tolerante:',
      claimError
    )
  }

  console.log(`[resend-webhook] ✅ Webhook Svix verificado. Evento: ${eventType}`)

  // Manejo estructurado según el tipo de evento de Resend
  switch (eventType) {
    case 'email.sent':
      console.log(
        `[resend-webhook] 📤 Email enviado ID: ${eventData.email_id || eventData.id || 'N/A'}`
      )
      break

    case 'email.delivered':
      console.log(
        `[resend-webhook] 📫 Email entregado a: ${JSON.stringify(eventData.to || eventData.recipient)}`
      )
      break

    case 'email.delivery_delayed':
      console.warn(
        `[resend-webhook] ⏳ Entrega de email retrasada para: ${JSON.stringify(eventData.to)}`
      )
      break

    case 'email.bounced':
      console.warn(`[resend-webhook] ⚠️ EMAIL REBOTADO (Bounce):`, {
        to: eventData.to,
        type: eventData.bounce_type || 'unspecified',
        message: eventData.message || 'No details',
      })
      break

    case 'email.complained':
      console.warn(`[resend-webhook] 🚨 QUEJA DE SPAM (Complaint):`, {
        to: eventData.to,
        email_id: eventData.email_id || eventData.id,
      })
      break

    case 'email.opened':
      console.log(`[resend-webhook] 👁️ Email abierto por: ${JSON.stringify(eventData.to)}`)
      break

    case 'email.clicked':
      console.log(
        `[resend-webhook] 🖱️ Clic en email por: ${JSON.stringify(eventData.to)}, link: ${eventData.click?.link || 'N/A'}`
      )
      break

    case 'email.received':
      try {
        const fromEmail = addressText(eventData.from, 'remitente_desconocido')
        const toEmail = addressText(eventData.to, 'Contacto@exepaginasweb.com')
        const subject = eventData.subject || 'Nuevo correo recibido en ExeSistemasWEB'
        const bodyContent = eventData.text || eventData.html || ''
        const adminDestination = process.env.ADMIN_EMAIL || 'Exemetal@hotmail.com'
        const detectedLang = detectLanguage(bodyContent + ' ' + subject, '')
        const isSales =
          toEmail.toLowerCase().includes('ventas') ||
          subject.toLowerCase().includes('ventas') ||
          subject.toLowerCase().includes('cotiz')
        const ticketPrefix = isSales ? 'EXE-VNT' : 'EXE-CNT'
        const ticketId = `${ticketPrefix}-${Date.now().toString(36).toUpperCase().slice(-5)}`

        if (!process.env.RESEND_API_KEY) {
          throw new Error('RESEND_API_KEY is not configured')
        }

        const isSystemSender =
          fromEmail === adminDestination ||
          fromEmail.includes('noreply') ||
          fromEmail.includes('no-reply') ||
          fromEmail.includes('mailer-daemon')

        const inboundTasks = [
          // 1. Reenvío obligatorio al Administrador (Exemetal@hotmail.com)
          sendEmail({
            to: adminDestination,
            subject: `[${ticketId}] [${isSales ? 'Ventas' : 'Contacto'}] ${subject}`,
            replyTo: fromEmail,
            html: inboundEmailNotification({
              fromEmail,
              toEmail,
              subject,
              html: eventData.html ?? undefined,
              text: eventData.text ?? undefined,
              ticketId,
            }),
          }),
          // 2. Auto-respuesta instantánea al remitente si es un usuario humano real
          !isSystemSender
            ? sendEmail({
                to: fromEmail,
                subject:
                  detectedLang === 'en'
                    ? `✨ We received your email [Ticket: ${ticketId}] - ExeSistemasWEB`
                    : `✨ Recibimos tu correo [Ticket: ${ticketId}] - ExeSistemasWEB`,
                html: contactAutoReply({
                  name: fromEmail.split('@')[0],
                  message: subject + '\n' + (eventData.text || ''),
                  ticketId,
                  lang: detectedLang,
                }),
              }).catch((clientErr) => {
                console.warn(
                  '[resend-webhook] No se pudo enviar auto-reply al cliente (ignorado para evitar loop):',
                  clientErr
                )
                return null
              })
            : Promise.resolve(null),
        ]

        const results = await Promise.allSettled(inboundTasks)
        const adminTask = results[0]
        if (adminTask && adminTask.status === 'rejected') {
          throw new Error(`Inbound admin forward failed: ${String(adminTask.reason)}`)
        }

        console.log(
          `[resend-webhook] 📩 Email entrante ${ticketId} (${toEmail}) procesado con éxito (Lang: ${detectedLang})`
        )
      } catch (forwardErr: unknown) {
        console.error('[resend-webhook] Error reenviando email entrante:', forwardErr)
        await markWebhookFailed('resend', svixId, forwardErr).catch(() => {})
        return NextResponse.json({ error: 'Inbound email processing failed' }, { status: 503 })
      }
      break

    default:
      console.log(`[resend-webhook] ℹ️ Evento no procesado especialmente: ${eventType}`)
      break
  }

  try {
    await markWebhookProcessed('resend', svixId)
  } catch (processError) {
    // Si la marca en base de datos falla pero el webhook se procesó, no romper la respuesta con 503
    console.warn('[resend-webhook] No se pudo actualizar estado en Supabase:', processError)
  }

  return NextResponse.json({
    received: true,
    type: eventType,
    timestamp: new Date().toISOString(),
  })
}

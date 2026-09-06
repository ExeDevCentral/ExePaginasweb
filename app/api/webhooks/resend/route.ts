import { NextRequest, NextResponse } from 'next/server'
import { Webhook } from 'svix'
import { sendEmail } from '@/lib/email/send'
import { inboundEmailNotification, contactAutoReply } from '@/lib/email/templates.js'
import { detectLanguage } from '../../contact/route'
import {
  claimWebhookEvent,
  markWebhookFailed,
  markWebhookProcessed,
} from '@/lib/server/webhookEvents'

type ResendAddress = string | string[] | { email?: string }
type ResendEventData = {
  id?: string
  email_id?: string
  to?: ResendAddress
  recipient?: ResendAddress
  from?: ResendAddress
  subject?: string
  text?: string
  html?: string
  bounce_type?: string
  message?: string
  click?: { link?: string }
}
type ResendEvent = {
  type?: string
  event?: string
  data?: ResendEventData
  [key: string]: unknown
}

function addressText(value: ResendAddress | undefined, fallback: string): string {
  if (typeof value === 'string') return value
  if (Array.isArray(value)) return value.join(', ')
  return value?.email || fallback
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
    event = wh.verify(payloadString, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as ResendEvent
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

  try {
    const claimed = await claimWebhookEvent('resend', svixId, eventType, event)
    if (!claimed) {
      return NextResponse.json({ received: true, type: eventType, duplicate: true })
    }
  } catch (claimError) {
    console.error('[resend-webhook] Failed to claim event:', claimError)
    return NextResponse.json({ error: 'Webhook storage unavailable' }, { status: 503 })
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

        {
          const inboundTasks = [
            // 1. Reenvío al Administrador (Exemetal@hotmail.com)
            sendEmail({
              to: adminDestination,
              subject: `[${ticketId}] [${isSales ? 'Ventas' : 'Contacto'}] ${subject}`,
              replyTo: fromEmail,
              html: inboundEmailNotification({
                fromEmail,
                toEmail,
                subject,
                html: eventData.html,
                text: eventData.text,
                ticketId,
              }),
            }),
            // 2. Auto-respuesta instantánea al remitente si no es el admin
            fromEmail !== adminDestination
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
                })
              : Promise.resolve(null),
          ]

          const results = await Promise.allSettled(inboundTasks)
          const failedTasks = results.filter((result) => result.status === 'rejected')
          if (failedTasks.length > 0) {
            throw new Error(`${failedTasks.length} inbound email task(s) failed`)
          }
          console.log(
            `[resend-webhook] 📩 Email entrante ${ticketId} (${toEmail}) procesado con éxito (Lang: ${detectedLang})`
          )
        }
      } catch (forwardErr: unknown) {
        console.error('[resend-webhook] Error reenviando email entrante:', forwardErr)
        await markWebhookFailed('resend', svixId, forwardErr)
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
    await markWebhookFailed('resend', svixId, processError)
    return NextResponse.json(
      { error: 'Webhook processing could not be confirmed' },
      { status: 503 }
    )
  }

  return NextResponse.json({
    received: true,
    type: eventType,
    timestamp: new Date().toISOString(),
  })
}

import { NextRequest, NextResponse } from 'next/server'
import { Webhook } from 'svix'
import { supabaseAdmin as supabase } from '@/lib/supabase/admin'
import { sendEmail } from '@/lib/email/send'
import { inboundEmailNotification, contactAutoReply } from '@/lib/email/templates.js'
import { detectLanguage } from '../../contact/route'

export async function POST(req: NextRequest) {
  const secret =
    process.env.RESEND_WEBHOOK_SIGNING_SECRET ||
    process.env.RESEND_WEBHOOK_SECRET ||
    process.env.SVIX_SECRET ||
    (process.env.NODE_ENV === 'test' ? 'whsec_1wqr6i61tWc8Px+eyWWaLo7uljYH5cCT' : null)

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
  } catch (err: any) {
    console.error('[resend-webhook] Error reading request raw body:', err)
    return NextResponse.json({ error: 'Error reading request body' }, { status: 400 })
  }

  let event: any
  try {
    const wh = new Webhook(secret)
    event = wh.verify(payloadString, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    })
  } catch (err: any) {
    console.error('[resend-webhook] Signature verification failed:', err.message)
    return NextResponse.json(
      { error: `Webhook signature verification failed: ${err.message}` },
      { status: 400 }
    )
  }

  const eventType = event.type || event.event || 'unknown'
  const eventData = event.data || event

  console.log(`[resend-webhook] ✅ Webhook Svix verificado. Evento: ${eventType}`)

  if (supabase) {
    try {
      await supabase.from('webhook_events').insert({
        event_type: eventType,
        provider: 'resend',
        payload: eventData,
        raw: event,
        created_at: new Date().toISOString(),
      })
    } catch (dbErr: any) {
      console.warn('[resend-webhook] Warning guardando evento en Supabase:', dbErr.message)
    }
  }

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
        const fromEmail =
          typeof eventData.from === 'string'
            ? eventData.from
            : eventData.from?.email || eventData.from?.[0] || 'remitente_desconocido'
        const subject = eventData.subject || 'Nuevo correo recibido en Contacto@exepaginasweb.com'
        const bodyContent = eventData.text || eventData.html || ''
        const adminDestination = process.env.ADMIN_EMAIL || 'Exemetal@hotmail.com'
        const detectedLang = detectLanguage(bodyContent + ' ' + subject, '')
        const ticketId = `EXE-MX-${Date.now().toString(36).toUpperCase().slice(-5)}`

        if (process.env.RESEND_API_KEY) {
          const inboundTasks = [
            // 1. Reenvío al Administrador
            sendEmail({
              to: adminDestination,
              subject: `[${ticketId}] [Email Entrante] ${subject}`,
              replyTo: fromEmail,
              html: inboundEmailNotification({
                fromEmail,
                subject,
                html: eventData.html,
                text: eventData.text,
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

          await Promise.allSettled(inboundTasks)
          console.log(
            `[resend-webhook] 📩 Email entrante ${ticketId} procesado con éxito (Lang: ${detectedLang})`
          )
        }
      } catch (forwardErr: any) {
        console.error('[resend-webhook] Error reenviando email entrante:', forwardErr.message)
      }
      break

    default:
      console.log(`[resend-webhook] ℹ️ Evento no procesado especialmente: ${eventType}`)
      break
  }

  return NextResponse.json({
    received: true,
    type: eventType,
    timestamp: new Date().toISOString(),
  })
}

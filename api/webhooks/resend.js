import { createClient } from '@supabase/supabase-js'
import { Webhook } from 'svix'
import { sendEmail } from '../lib/email/send.js'

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || ''
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null

export const config = {
  api: {
    bodyParser: false,
  },
}

async function getRawBody(req) {
  if (req.rawBody) {
    return typeof req.rawBody === 'string' ? req.rawBody : req.rawBody.toString('utf8')
  }
  if (Buffer.isBuffer(req.body)) {
    return req.body.toString('utf8')
  }
  if (typeof req.body === 'string') {
    return req.body
  }
  if (req.body && typeof req.body === 'object') {
    return JSON.stringify(req.body)
  }
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', (chunk) => chunks.push(chunk))
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', (err) => reject(err))
  })
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const secret =
    process.env.RESEND_WEBHOOK_SIGNING_SECRET ||
    process.env.RESEND_WEBHOOK_SECRET ||
    process.env.SVIX_SECRET ||
    'whsec_1wqr6i61tWc8Px+eyWWaLo7uljYH5cCT'

  const svixId = req.headers['svix-id']
  const svixTimestamp = req.headers['svix-timestamp']
  const svixSignature = req.headers['svix-signature']

  if (!svixId || !svixTimestamp || !svixSignature) {
    console.warn('[resend-webhook] Missing Svix headers in webhook request')
    return res.status(400).json({ error: 'Missing Svix signature headers' })
  }

  let payloadString = ''
  try {
    payloadString = await getRawBody(req)
  } catch (err) {
    console.error('[resend-webhook] Error reading request raw body:', err)
    return res.status(400).json({ error: 'Error reading request body' })
  }

  let event
  try {
    const wh = new Webhook(secret)
    event = wh.verify(payloadString, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    })
  } catch (err) {
    console.error('[resend-webhook] Signature verification failed:', err.message)
    return res.status(400).json({ error: `Webhook signature verification failed: ${err.message}` })
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
    } catch (dbErr) {
      console.warn('[resend-webhook] Warning guardando evento en Supabase:', dbErr.message)
    }
  }

  // Manejo de correos entrantes (Resend Inbound)
  if (eventType === 'email.received') {
    try {
      const fromEmail =
        typeof eventData.from === 'string'
          ? eventData.from
          : eventData.from?.email || eventData.from?.[0] || 'remitente_desconocido'
      const subject = eventData.subject || 'Nuevo correo recibido en Contacto@exepaginasweb.com'
      const htmlBody =
        eventData.html || `<pre>${eventData.text || 'Sin contenido en el cuerpo del correo'}</pre>`
      const adminDestination = process.env.ADMIN_EMAIL || 'Exemetal@hotmail.com'

      if (process.env.RESEND_API_KEY) {
        await sendEmail({
          to: adminDestination,
          subject: `[Email Entrante] ${subject}`,
          replyTo: fromEmail,
          html: `
            <div style="font-family: sans-serif; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; max-width: 600px; margin: 0 auto; color: #1f2937;">
              <h2 style="color: #4f46e5; margin-top: 0;">Nuevo correo recibido en Contacto@exepaginasweb.com</h2>
              <p><strong>De:</strong> ${fromEmail}</p>
              <p><strong>Asunto original:</strong> ${subject}</p>
              <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 16px 0;" />
              <div style="background-color: #f9fafb; padding: 16px; border-radius: 6px; border: 1px solid #f3f4f6;">
                ${htmlBody}
              </div>
              <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 16px 0;" />
              <p style="font-size: 13px; color: #6b7280; margin-bottom: 0;">
                💡 <em>Tip: Si haces clic en "Responder" a este mensaje, le escribirás directamente a <strong>${fromEmail}</strong>.</em>
              </p>
            </div>
          `,
        })
        console.log(`[resend-webhook] 📩 Email entrante reenviado con éxito a ${adminDestination}`)
      }
    } catch (forwardErr) {
      console.error('[resend-webhook] Error reenviando email entrante:', forwardErr.message)
    }
  }

  return res.status(200).json({
    received: true,
    type: eventType,
    timestamp: new Date().toISOString(),
  })
}

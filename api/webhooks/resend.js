import { createClient } from '@supabase/supabase-js'
import { Webhook } from 'svix'
import { sendEmail } from '../lib/email/send.js'
import { inboundEmailNotification } from '../lib/email/templates.js'

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
      const adminDestination = process.env.ADMIN_EMAIL || 'Exemetal@hotmail.com'

      if (process.env.RESEND_API_KEY) {
        await sendEmail({
          to: adminDestination,
          subject: `[Email Entrante] ${subject}`,
          replyTo: fromEmail,
          html: inboundEmailNotification({
            fromEmail,
            subject,
            html: eventData.html,
            text: eventData.text,
          }),
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

import { sendEmail } from './lib/email/send.js'
import { contactNotification } from './lib/email/templates.js'

const RATE_LIMIT_WINDOW_MS = 3600_000
const RATE_LIMIT_MAX_REQUESTS = 5
const requestLog = new Map()

function getClientIp(req) {
  const forwardedFor = req.headers['x-forwarded-for']
  if (typeof forwardedFor === 'string' && forwardedFor.length > 0) {
    return forwardedFor.split(',')[0].trim()
  }
  return req.socket?.remoteAddress ?? 'unknown'
}

function isRateLimited(ip) {
  const now = Date.now()
  const previous = requestLog.get(ip) ?? []
  const recent = previous.filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS)
  if (recent.length >= RATE_LIMIT_MAX_REQUESTS) {
    requestLog.set(ip, recent)
    return true
  }
  recent.push(now)
  requestLog.set(ip, recent)
  return false
}

function setCorsHeaders(res, req) {
  const allowedOrigins = [
    process.env.VITE_SITE_URL,
    process.env.SITE_URL,
    'https://exepaginasweb.com',
    'https://www.exepaginasweb.com',
  ].filter(Boolean)
  const origin = req.headers?.origin
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
}

export default async function handler(req, res) {
  setCorsHeaders(res, req)
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const ip = getClientIp(req)
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Demasiados mensajes. Intenta más tarde.' })
  }

  const { name, email, message } = req.body || {}
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Faltan campos requeridos.' })
  }

  console.log(`[contact] Mensaje de ${name} <${email}>: ${message.slice(0, 100)}...`)

  try {
    if (process.env.RESEND_API_KEY) {
      await sendEmail({
        to: ['exemetal@hotmail.com'],
        subject: `Nuevo contacto de ${name} <${email}>`,
        html: contactNotification({ name, email, message }),
        replyTo: email,
      })
    } else {
      console.warn('[contact] RESEND_API_KEY no configurada — email no enviado')
    }

    return res.status(200).json({ ok: true, message: 'Mensaje recibido. Te contactaremos pronto.' })
  } catch (err) {
    console.error('[contact] Error al enviar email:', err)
    return res.status(200).json({ ok: true, message: 'Mensaje recibido. Te contactaremos pronto.' })
  }
}

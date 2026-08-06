import { sendEmail, ADMIN_EMAIL } from '../lib/email/send.js'
import { contactNotification, contactAutoReply } from '../lib/email/templates.js'

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

export function detectLanguage(text, clientLang) {
  if (clientLang && typeof clientLang === 'string') {
    const normalized = clientLang.toLowerCase().trim()
    if (normalized.startsWith('en')) return 'en'
    if (normalized.startsWith('es')) return 'es'
  }
  if (!text || typeof text !== 'string') return 'es'
  const englishPattern =
    /\b(hello|hi|dear|thanks|thank|please|website|project|build|pricing|price|quote|business|inquiry|looking|would like|can you|how much)\b/i
  return englishPattern.test(text) ? 'en' : 'es'
}

export default async function handler(req, res) {
  setCorsHeaders(res, req)
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const ip = getClientIp(req)
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Demasiados mensajes. Intenta más tarde.' })
  }

  const { name, email, message, lang, locale } = req.body || {}
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Faltan campos requeridos.' })
  }

  const clientLang = lang || locale || req.headers['accept-language']
  const detectedLang = detectLanguage(message, clientLang)
  const ticketId = `EXE-CNT-${Date.now().toString(36).toUpperCase().slice(-5)}`

  console.log(
    `[contact] [${ticketId}] [Lang: ${detectedLang}] Mensaje de ${name} <${email}>: ${message.slice(0, 100)}...`
  )

  try {
    if (process.env.RESEND_API_KEY) {
      // Envío en PARALELO para máxima performance
      const autoReplySubject =
        detectedLang === 'en'
          ? `✨ We received your message [Ticket: ${ticketId}] - ExeSistemasWEB`
          : `✨ Recibimos tu mensaje [Ticket: ${ticketId}] - ExeSistemasWEB`

      const emailTasks = [
        // 1. Notificación al Administrador
        sendEmail({
          to: [ADMIN_EMAIL],
          subject: `[${ticketId}] Nuevo contacto de ${name} <${email}>`,
          html: contactNotification({ name, email, message, ticketId }),
          replyTo: email,
        }),
        // 2. Respuesta Automática Instantánea al Cliente en su idioma (es / en)
        sendEmail({
          to: [email],
          subject: autoReplySubject,
          html: contactAutoReply({ name, message, ticketId, lang: detectedLang }),
        }),
      ]

      const results = await Promise.allSettled(emailTasks)
      results.forEach((res, index) => {
        if (res.status === 'rejected') {
          console.error(
            `[contact] [${ticketId}] Error en envío de email ${index === 0 ? 'Admin' : 'Cliente'}:`,
            res.reason
          )
        } else {
          console.log(
            `[contact] [${ticketId}] Email ${index === 0 ? 'Admin' : 'Cliente'} enviado correctamente`
          )
        }
      })
    } else {
      console.warn('[contact] RESEND_API_KEY no configurada — emails no enviados')
    }

    const clientMsg =
      detectedLang === 'en'
        ? 'Message successfully received. We sent a confirmation to your email address.'
        : 'Mensaje recibido con éxito. Te enviamos una confirmación a tu correo electrónico.'

    return res.status(200).json({
      ok: true,
      ticketId,
      lang: detectedLang,
      message: clientMsg,
    })
  } catch (err) {
    console.error('[contact] Error general procesando mensaje:', err)
    return res.status(200).json({
      ok: true,
      ticketId,
      lang: detectedLang,
      message: 'Mensaje recibido con éxito. Te contactaremos pronto.',
    })
  }
}

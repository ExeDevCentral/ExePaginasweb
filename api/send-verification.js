import { sendEmail } from '../lib/email/send.js'
import { emailVerification } from '../lib/email/templates.js'

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
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
}

function sanitizeUrl(targetUrl) {
  const defaultUrl = `${process.env.SITE_URL || 'https://exepaginasweb.com'}/dashboard`
  if (!targetUrl || typeof targetUrl !== 'string') return defaultUrl

  try {
    const parsed = new URL(targetUrl)
    const allowedHosts = ['exepaginasweb.com', 'www.exepaginasweb.com', 'localhost', '127.0.0.1']
    if (process.env.SITE_URL) {
      try {
        allowedHosts.push(new URL(process.env.SITE_URL).hostname)
      } catch (e) {
        // Ignorar URL env malformada y conservar fallback seguro
        void e
      }
    }

    if (allowedHosts.includes(parsed.hostname)) {
      return parsed.toString()
    }
  } catch {
    // URL inválida, retornar fallback seguro
  }
  return defaultUrl
}

export default async function handler(req, res) {
  setCorsHeaders(res, req)
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const ip = getClientIp(req)
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Demasiadas solicitudes. Intenta más tarde.' })
  }

  const { email, name, verificationUrl, token } = req.body || {}

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'El email del destinatario es obligatorio.' })
  }

  try {
    if (!process.env.RESEND_API_KEY) {
      console.warn('[verification-email] RESEND_API_KEY no configurada')
      return res.status(503).json({ error: 'Servicio de email no configurado en el servidor.' })
    }

    const safeUrl = sanitizeUrl(verificationUrl)
    const html = emailVerification({
      name,
      verificationUrl: safeUrl,
      token,
    })

    const result = await sendEmail({
      to: [email],
      subject: '🔒 Confirma tu cuenta de correo electrónico — ExeSistemasWEB',
      html,
    })

    return res.status(200).json({
      ok: true,
      message: 'Email de verificación enviado exitosamente.',
      data: result,
    })
  } catch (err) {
    console.error('[verification-email] Error al enviar email de verificación:', err)
    return res.status(500).json({
      error: 'Error al enviar el email de verificación.',
      details: err.message,
    })
  }
}

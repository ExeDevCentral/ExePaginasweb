import { Resend } from 'resend'
import fs from 'fs'

const logFile = 'api-debug.log'
const log = (msg) => fs.appendFileSync(logFile, `${new Date().toISOString()} - ${msg}\n`)

const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX_REQUESTS = 8
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

function sanitize(value) {
  return String(value ?? '').replaceAll(/[<>]/g, '').trim()
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  }

  const ip = getClientIp(req)
  log(`Request from ${ip}`)
  if (isRateLimited(ip)) {
    return res.status(429).json({ ok: false, error: 'Too many requests, try later.' })
  }

  const apiKey = process.env.RESEND_API_KEY
  const toEmail = process.env.CONTACT_TO_EMAIL || 'Exemetal@hotmail.com'
  const fromEmail = process.env.CONTACT_FROM_EMAIL

  if (!apiKey || !fromEmail) {
    return res.status(500).json({ ok: false, error: 'Missing email server configuration.' })
  }

  const name = sanitize(req.body?.name)
  const email = sanitize(req.body?.email)
  const message = sanitize(req.body?.message)

  if (!name || !email || !message) {
    return res.status(400).json({ ok: false, error: 'All fields are required.' })
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ ok: false, error: 'Invalid email address.' })
  }

  if (name.length > 120 || email.length > 200 || message.length > 3000) {
    return res.status(400).json({ ok: false, error: 'Input is too long.' })
  }

  try {
    const resend = new Resend(apiKey)
    await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      replyTo: email,
      subject: `Nuevo contacto web: ${name}`,
      text: `Nombre: ${name}\nEmail: ${email}\n\nMensaje:\n${message}`,
      html: `
        <h2>Nuevo formulario de contacto</h2>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${message.replaceAll('\n', '<br/>')}</p>
      `,
    })

    return res.status(200).json({ ok: true })
  } catch {
    return res.status(500).json({ ok: false, error: 'Could not send email.' })
  }
}

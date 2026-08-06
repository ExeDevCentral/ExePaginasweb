import { sendEmail } from '../lib/email/send.js'
import { emailVerification } from '../lib/email/templates.js'

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
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*')
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
}

export default async function handler(req, res) {
  setCorsHeaders(res, req)
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { email, name, verificationUrl, token } = req.body || {}

  if (!email) {
    return res.status(400).json({ error: 'El email del destinatario es obligatorio.' })
  }

  try {
    if (!process.env.RESEND_API_KEY) {
      console.warn('[verification-email] RESEND_API_KEY no configurada')
      return res.status(503).json({ error: 'Servicio de email no configurado en el servidor.' })
    }

    const html = emailVerification({
      name,
      verificationUrl:
        verificationUrl || `${process.env.SITE_URL || 'https://exepaginasweb.com'}/dashboard`,
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

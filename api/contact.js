import { Resend } from 'resend'
import fs from 'fs'
import path from 'path'

const MESSAGES_FILE = path.join(process.cwd(), 'messages-local.json')

function setCorsHeaders(res) {
  // En producción (Vercel) esto es necesario, en local (api-dev-server) lo hace el middleware cors()
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  }
}

function saveMessageLocally(contactData) {
  try {
    // En Vercel no podemos escribir archivos. Solo permitimos esto en desarrollo.
    if (process.env.NODE_ENV === 'production') {
      console.warn('[contact] No se puede guardar localmente en producción (Sistema de archivos Read-Only)')
      return false
    }
    let messages = []
    if (fs.existsSync(MESSAGES_FILE)) {
      const content = fs.readFileSync(MESSAGES_FILE, 'utf-8')
      messages = JSON.parse(content)
    }
    messages.push({
      ...contactData,
      receivedAt: new Date().toISOString(),
      source: 'contact_form'
    })
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2))
    console.log(`[contact] Mensaje guardado localmente en ${MESSAGES_FILE}`)
    return true
  } catch (err) {
    console.error('[contact] Error guardando mensaje localmente:', err)
    return false
  }
}

export default async function handler(req, res) {
  setCorsHeaders(res)

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!req.body) {
    return res.status(400).json({ error: 'No se recibieron datos en el cuerpo de la petición.' })
  }

  // Asegurar que el body esté parseado correctamente
  let body = req.body || {}
  if (typeof body === 'string') {
    try { body = JSON.parse(body) } catch (e) { body = {} }
  }

  const { name, email, message } = body

  // Validación de campos
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Todos los campos son requeridos: name, email, message.' })
  }

  // Validación básica de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'El correo electrónico no es válido.' })
  }

  // Validación de longitud
  if (message.length > 5000) {
    return res.status(400).json({ error: 'El mensaje es demasiado largo (máximo 5000 caracteres).' })
  }

  const resendApiKey = process.env.RESEND_API_KEY
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'
  const toEmail = process.env.RESEND_TO_EMAIL || 'Exemetal@hotmail.com'

  // Si no hay API key de Resend, guardamos localmente como fallback
  if (!resendApiKey) {
    console.warn('[contact] Sin RESEND_API_KEY, guardando mensaje localmente')
    const saved = saveMessageLocally({ name, email, message })
    if (saved) {
      return res.status(200).json({
        ok: true,
        savedLocally: true,
        message: 'Mensaje recibido. Te contactaremos pronto.',
      })
    }
    return res.status(500).json({
      error: 'El servidor no está configurado para enviar emails. Contacta al administrador.',
      code: 'MISSING_RESEND_KEY'
    })
  }

  try {
    const resend = new Resend(resendApiKey)

    const { data, error } = await resend.emails.send({
      from: `ExepaginasWeb <${fromEmail}>`,
      to: [toEmail],
      replyTo: email,
      subject: `Nuevo mensaje de contacto de ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
          <h2 style="color: #00ffff; border-bottom: 2px solid #ff00ff; padding-bottom: 10px;">
            📬 Nuevo mensaje de contacto
          </h2>
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; width: 120px;">Nombre:</td>
              <td style="padding: 10px; border-bottom: 1px solid #eee;">${escapeHtml(name)}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Email:</td>
              <td style="padding: 10px; border-bottom: 1px solid #eee;">${escapeHtml(email)}</td>
            </tr>
            <tr>
              <td style="padding: 10px; font-weight: bold; vertical-align: top;">Mensaje:</td>
              <td style="padding: 10px; white-space: pre-wrap;">${escapeHtml(message)}</td>
            </tr>
          </table>
          <p style="margin-top: 30px; font-size: 12px; color: #999; text-align: center;">
            Enviado desde ExepaginasWeb | ${new Date().toLocaleString('es-AR')}
          </p>
        </div>
      `,
      text: `Nuevo mensaje de contacto\n\nNombre: ${name}\nEmail: ${email}\n\nMensaje:\n${message}`,
    })

    if (error) {
      console.error('[contact] Resend error:', error)
      // Si es error 403 (dominio no verificado), guardar localmente como fallback
      if (error.statusCode === 403 || error.message?.includes('domain')) {
        const saved = saveMessageLocally({ name, email, message, resendError: error.message })
        if (saved) {
          return res.status(200).json({
            ok: true,
            savedLocally: true,
            message: 'Mensaje recibido y guardado. Te contactaremos pronto.',
          })
        }
      }
      return res.status(500).json({
        error: 'No se pudo enviar el email. Intenta de nuevo más tarde.',
        details: error.message,
      })
    }

    console.log(`[contact] Email sent successfully to ${toEmail} from ${email} (id: ${data?.id})`)

    return res.status(200).json({
      ok: true,
      message: 'Mensaje enviado correctamente. Te respondemos lo antes posible.',
      emailId: data?.id,
    })
  } catch (err) {
    console.error('[contact] Unexpected error:', err)
    // Guardar localmente como último recurso
    const saved = saveMessageLocally({ name, email, message, error: err.message })
    if (saved) {
      return res.status(200).json({
        ok: true,
        savedLocally: true,
        message: 'Mensaje recibido y guardado. Te contactaremos pronto.',
      })
    }
    return res.status(500).json({
      error: 'Error inesperado al enviar el mensaje. Intenta de nuevo en unos minutos.',
    })
  }
}

function escapeHtml(text) {
  if (typeof text !== 'string') return ''
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '"')
    .replace(/'/g, '&#039;')
}

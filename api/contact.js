import { Resend } from 'resend'

function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
}

export default async function handler(req, res) {
  setCorsHeaders(res)

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { name, email, message } = req.body

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

  // Si no hay API key de Resend, devolvemos un error claro
  if (!resendApiKey) {
    console.error('[contact] Missing RESEND_API_KEY environment variable')
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
    return res.status(500).json({
      error: 'Error inesperado al enviar el mensaje. Intenta de nuevo en unos minutos.',
    })
  }
}

function escapeHtml(text) {
  const div = typeof document !== 'undefined' ? document.createElement('div') : null
  if (div) {
    div.textContent = text
    return div.innerHTML
  }
  // Fallback server-side
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '"')
    .replace(/'/g, '&#039;')
}


const RESEND_API = 'https://api.resend.com/emails'

function getConfig() {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    throw new Error('RESEND_API_KEY no configurada')
  }
  return {
    apiKey,
    from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
  }
}

export async function sendEmail({ to, subject, html, replyTo }) {
  const { apiKey, from } = getConfig()

  const payload = {
    from,
    to: Array.isArray(to) ? to : [to],
    subject,
    html,
  }
  if (replyTo) payload.replyTo = replyTo

  const res = await fetch(RESEND_API, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const err = await res.text()
    console.error('[email] Error al enviar:', res.status, err)
    throw new Error(`Resend error: ${res.status}`)
  }

  console.log('[email] Enviado correctamente a', to)
  return res.json()
}

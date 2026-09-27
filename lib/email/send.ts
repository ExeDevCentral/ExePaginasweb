/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
const RESEND_API = 'https://api.resend.com/emails'

export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'Exemetal@hotmail.com'
export const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'Contacto@exepaginasweb.com'
export const SALES_EMAIL = process.env.SALES_EMAIL || 'Ventas@exepaginasweb.com'

export interface EmailTag {
  name: string
  value: string
}

export interface SendEmailOptions {
  to: string | string[]
  subject: string
  html?: string | undefined
  replyTo?: string | undefined
  tags?: EmailTag[] | undefined
  headers?: Record<string, string> | undefined
  template?:
    | {
        id: string
        variables?: Record<string, unknown> | undefined
      }
    | undefined
}

export interface SyncAudienceContactOptions {
  email: string
  firstName?: string | undefined
  lastName?: string | undefined
  unsubscribed?: boolean | undefined
  audienceId?: string | undefined
}

function getConfig() {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    throw new Error('RESEND_API_KEY no configurada')
  }
  return {
    apiKey,
    from: process.env.RESEND_FROM_EMAIL || 'Contacto@exepaginasweb.com',
  }
}

export async function sendEmail({
  to,
  subject,
  html,
  replyTo,
  tags,
  headers,
  template,
}: SendEmailOptions) {
  const { apiKey, from } = getConfig()

  const payload: Record<string, unknown> = {
    from,
    to: Array.isArray(to) ? to : [to],
    subject,
  }

  if (html) payload.html = html
  if (replyTo) {
    payload.reply_to = replyTo
    payload.replyTo = replyTo
  }
  if (tags && tags.length > 0) payload.tags = tags
  if (headers && Object.keys(headers).length > 0) payload.headers = headers
  if (template) payload.template = template

  const res = await fetch(RESEND_API, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(8000),
  })

  if (!res.ok) {
    const err = await res.text()
    console.error('[email] Error al enviar:', res.status, err)
    throw new Error(`Resend error: ${res.status}`)
  }

  console.log('[email] Enviado correctamente a', to)
  return res.json()
}

/**
 * Sincroniza un contacto/lead capturado en la audiencia de Resend para email marketing.
 */
export async function syncContactToAudience({
  email,
  firstName,
  lastName,
  unsubscribed = false,
  audienceId,
}: SyncAudienceContactOptions) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey || !email || typeof email !== 'string') return null

  const targetAudience = audienceId || process.env.RESEND_AUDIENCE_ID
  const url = targetAudience
    ? `https://api.resend.com/audiences/${targetAudience}/contacts`
    : 'https://api.resend.com/contacts'

  try {
    const payload: Record<string, unknown> = {
      email: email.trim().toLowerCase(),
      unsubscribed,
    }
    if (firstName) payload.first_name = firstName.trim()
    if (lastName) payload.last_name = lastName.trim()
    if (!targetAudience && process.env.RESEND_AUDIENCE_ID) {
      payload.audience_id = process.env.RESEND_AUDIENCE_ID
    }

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(5000),
    })

    if (!res.ok) {
      const errText = await res.text()
      // Si el contacto ya existe, no es un error
      if (res.status === 409 || errText.includes('already_exists')) {
        console.log(`[resend-audience] Contacto ${email} ya registrado en audiencia.`)
        return { status: 'exists' }
      }
      console.warn(`[resend-audience] Advertencia al sincronizar ${email}:`, res.status, errText)
      return null
    }

    const data = await res.json()
    console.log(`[resend-audience] ✅ Contacto sincronizado en Resend Audience: ${email}`)
    return data
  } catch (err) {
    console.warn(`[resend-audience] Excepción al sincronizar contacto ${email}:`, err)
    return null
  }
}

/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
const RESEND_API = 'https://api.resend.com/emails'
const RESEND_WEBHOOKS_API = 'https://api.resend.com/webhooks'

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

export interface WebhookStatusReport {
  checked: boolean
  total: number
  enabled: number
  reactivated: number
  errors?: string[]
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

/**
 * Espera pasiva defensiva para respetar el rate-limit del modo gratis de Resend (2 req/seg).
 */
const waitMs = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function sendEmail({
  to,
  subject,
  html,
  replyTo,
  tags,
  headers,
  template,
}: SendEmailOptions): Promise<Record<string, unknown>> {
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

  const maxAttempts = 2
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const res = await fetch(RESEND_API, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(8000),
      })

      if (res.ok) {
        const json = (await res.json()) as Record<string, unknown>
        console.log('[email] Enviado correctamente a', to)
        return json
      }

      // Si el plan gratis llega al límite de ráfaga (429 Rate Limit) o error temporal 5xx
      if ((res.status === 429 || res.status >= 500) && attempt < maxAttempts) {
        console.warn(
          `[email] Resend respondió ${res.status}. Reintentando con retroceso en modo gratis...`
        )
        await waitMs(650)
        continue
      }

      const errText = await res.text()
      console.error('[email] Error al enviar:', res.status, errText)
      throw new Error(`Resend error: ${res.status}`)
    } catch (err) {
      if (attempt < maxAttempts && err instanceof Error && err.name === 'TimeoutError') {
        await waitMs(500)
        continue
      }
      throw err
    }
  }

  throw new Error('Resend error: Max attempts reached')
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

/**
 * Auto-Healer para Webhooks de Resend:
 * Si Svix/Resend desactiva el endpoint tras reintentos fallidos, esta función
 * consulta la API de Resend y reactiva automáticamente cualquier webhook deshabilitado
 * sin necesidad de entrar a la consola manual.
 */
export async function ensureResendWebhooksActive(): Promise<WebhookStatusReport> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    return {
      checked: false,
      total: 0,
      enabled: 0,
      reactivated: 0,
      errors: ['RESEND_API_KEY no configurada'],
    }
  }

  try {
    const res = await fetch(RESEND_WEBHOOKS_API, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(6000),
    })

    if (!res.ok) {
      const err = await res.text()
      return {
        checked: false,
        total: 0,
        enabled: 0,
        reactivated: 0,
        errors: [`HTTP ${res.status}: ${err}`],
      }
    }

    const body = (await res.json()) as {
      data?: Array<{ id: string; status?: string; url?: string }>
    }
    const webhooks = body?.data || []
    let enabledCount = 0
    let reactivatedCount = 0
    const errors: string[] = []

    for (const wh of webhooks) {
      const status = wh.status?.toLowerCase()
      if (status === 'active' || status === 'enabled') {
        enabledCount++
      } else if (wh.id) {
        // Intentar reactivar vía PATCH
        try {
          const patchRes = await fetch(`${RESEND_WEBHOOKS_API}/${wh.id}`, {
            method: 'PATCH',
            headers: {
              Authorization: `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: 'enabled' }),
            signal: AbortSignal.timeout(5000),
          })
          if (patchRes.ok) {
            reactivatedCount++
            console.log(`[resend-healer] ✅ Webhook ${wh.id} reactivado automáticamente en Resend.`)
          } else {
            const patchErr = await patchRes.text()
            errors.push(`No se pudo reactivar ${wh.id}: ${patchErr}`)
          }
        } catch (patchEx) {
          errors.push(
            `Excepción reactivando ${wh.id}: ${patchEx instanceof Error ? patchEx.message : String(patchEx)}`
          )
        }
      }
    }

    return {
      checked: true,
      total: webhooks.length,
      enabled: enabledCount + reactivatedCount,
      reactivated: reactivatedCount,
      errors: errors.length > 0 ? errors : undefined,
    }
  } catch (err) {
    return {
      checked: false,
      total: 0,
      enabled: 0,
      reactivated: 0,
      errors: [err instanceof Error ? err.message : String(err)],
    }
  }
}

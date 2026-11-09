/**
 * © 2025 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
import { randomUUID } from 'node:crypto'

const RESEND_API = 'https://api.resend.com/emails'
const RESEND_WEBHOOKS_API = 'https://api.resend.com/webhooks'

export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'Exemetal@hotmail.com'
export const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'Contacto@exepaginasweb.com'
export const SALES_EMAIL = process.env.SALES_EMAIL || 'Ventas@exepaginasweb.com'
export const REPLY_TO_EMAIL = process.env.RESEND_REPLY_TO || CONTACT_EMAIL

export interface EmailTag {
  name: string
  value: string
}

export interface SendEmailOptions {
  to: string | string[]
  subject: string
  html?: string | undefined
  text?: string | undefined
  replyTo?: string | string[] | undefined
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
  errors?: string[] | undefined
}

/**
 * Elimina saltos de línea CR/LF y caracteres de control para prevenir CRLF Header Injection.
 */
export function sanitizeHeaderValue(value: string): string {
  if (!value || typeof value !== 'string') return ''
  return value
    .replace(/[\r\n\0]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Formatea el remitente con nombre de autoría directa si solo se especificó la casilla de correo.
 */
export function formatSenderAddress(rawFrom?: string): string {
  const clean = sanitizeHeaderValue(rawFrom || CONTACT_EMAIL) || CONTACT_EMAIL
  if (clean.includes('<') && clean.includes('>')) {
    return clean
  }
  return `Exequiel Echevarría · ExePaginasWeb <${clean}>`
}

/**
 * Genera una versión de texto plano limpia a partir de HTML para multipart/alternative en Resend,
 * mejorando la entregabilidad en Gmail, Outlook y Hotmail.
 */
export function htmlToPlainText(html?: string): string {
  if (!html || typeof html !== 'string') return ''
  return html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<head[\s\S]*?<\/head>/gi, '')
    .replace(/<div[^>]*max-height:\s*0[^>]*>[\s\S]*?<\/div>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|tr|li|h[1-6]|table)>/gi, '\n')
    .replace(/<\/?(strong|em|b|i|u|code|span|a)\b[^>]*>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&#847;/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#x27;/gi, "'")
    .split('\n')
    .map((line) =>
      line
        .replace(/\s+/g, ' ')
        .replace(/\s+([,.;:!?])/g, '$1')
        .trim()
    )
    .filter((line, idx, arr) => line.length > 0 || (idx > 0 && arr[idx - 1] !== ''))
    .join('\n')
    .trim()
}

function getConfig() {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    throw new Error('RESEND_API_KEY no configurada')
  }
  return {
    apiKey,
    from: formatSenderAddress(process.env.RESEND_FROM_EMAIL || CONTACT_EMAIL),
  }
}

/**
 * Espera pasiva defensiva para respetar el rate-limit del modo gratis de Resend (2 req/seg).
 */
const waitMs = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

let lastResendDispatchAt = 0
let resendQueue: Promise<void> = Promise.resolve()

/**
 * Espaciador de solicitudes en memoria para evitar colisiones 429 cuando se envían
 * correos al administrador y auto-respuesta al cliente en paralelo.
 */
async function paceResendCall(): Promise<void> {
  if (process.env.NODE_ENV === 'test') return
  const minIntervalMs = 520
  const prev = resendQueue
  let release!: () => void
  resendQueue = new Promise<void>((resolve) => {
    release = resolve
  })
  await prev
  try {
    const elapsed = Date.now() - lastResendDispatchAt
    if (elapsed < minIntervalMs) {
      await waitMs(minIntervalMs - elapsed)
    }
    lastResendDispatchAt = Date.now()
  } finally {
    release()
  }
}

export async function sendEmail({
  to,
  subject,
  html,
  text,
  replyTo,
  tags,
  headers,
  template,
}: SendEmailOptions): Promise<Record<string, unknown>> {
  const { apiKey, from } = getConfig()

  const recipients = (Array.isArray(to) ? to : [to])
    .map((addr) => sanitizeHeaderValue(addr))
    .filter(Boolean)

  const cleanSubject = sanitizeHeaderValue(subject) || 'Notificación — ExePaginasWeb'

  const effectiveReplyTo = replyTo ?? REPLY_TO_EMAIL
  const cleanReplyTo = Array.isArray(effectiveReplyTo)
    ? effectiveReplyTo.map((item) => sanitizeHeaderValue(item)).filter(Boolean)
    : sanitizeHeaderValue(effectiveReplyTo)

  const payload: Record<string, unknown> = {
    from,
    to: recipients,
    subject: cleanSubject,
  }

  if (html) {
    payload.html = html
    const generatedText = text ? text.trim() : htmlToPlainText(html)
    if (generatedText) {
      payload.text = generatedText
    }
  } else if (text) {
    payload.text = text.trim()
  }

  if (cleanReplyTo && (typeof cleanReplyTo === 'string' || cleanReplyTo.length > 0)) {
    payload.reply_to = cleanReplyTo
    payload.replyTo = cleanReplyTo
  }

  if (tags && tags.length > 0) {
    payload.tags = tags.map((tag) => ({
      name: sanitizeHeaderValue(tag.name).replace(/[^a-zA-Z0-9_-]/g, '_'),
      value: sanitizeHeaderValue(tag.value).replace(/[^a-zA-Z0-9_-]/g, '_'),
    }))
  }

  payload.headers = {
    'X-Entity-Ref-ID': randomUUID(),
    ...(headers || {}),
  }

  if (template) payload.template = template

  const maxAttempts = 3
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await paceResendCall()
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
        console.log('[email] Enviado correctamente a', recipients.join(', '))
        return json
      }

      // Si el plan gratis llega al límite de ráfaga (429 Rate Limit) o error temporal 5xx
      if ((res.status === 429 || res.status >= 500) && attempt < maxAttempts) {
        const retryAfterHeader = Number(res.headers.get('retry-after'))
        const backoffMs =
          Number.isFinite(retryAfterHeader) && retryAfterHeader > 0
            ? Math.min(retryAfterHeader * 1000, 3000)
            : 650 * attempt
        console.warn(
          `[email] Resend respondió ${res.status}. Reintentando en ${backoffMs}ms (intento ${attempt}/${maxAttempts})...`
        )
        await waitMs(backoffMs)
        continue
      }

      const errText = await res.text()
      console.error('[email] Error al enviar:', res.status, errText)
      throw new Error(`Resend error: ${res.status}`)
    } catch (err) {
      if (attempt < maxAttempts && err instanceof Error && err.name === 'TimeoutError') {
        await waitMs(500 * attempt)
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
    ? `https://api.resend.com/audiences/${encodeURIComponent(targetAudience)}/contacts`
    : 'https://api.resend.com/contacts'

  try {
    const payload: Record<string, unknown> = {
      email: sanitizeHeaderValue(email).toLowerCase(),
      unsubscribed,
    }
    if (firstName) payload.first_name = sanitizeHeaderValue(firstName)
    if (lastName) payload.last_name = sanitizeHeaderValue(lastName)
    if (!targetAudience && process.env.RESEND_AUDIENCE_ID) {
      payload.audience_id = process.env.RESEND_AUDIENCE_ID
    }

    await paceResendCall()
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
        try {
          const patchRes = await fetch(`${RESEND_WEBHOOKS_API}/${encodeURIComponent(wh.id)}`, {
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

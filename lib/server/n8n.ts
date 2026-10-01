/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Conector asíncrono para automatizaciones externas vía n8n Webhook.
 */

export interface N8nEventPayload {
  event:
    | 'lead.contact'
    | 'lead.chat'
    | 'payment.captured'
    | 'transfer.registered'
    | 'automation.trigger'
    | (string & {})
  ticketId?: string | undefined
  name?: string | undefined
  email?: string | undefined
  message?: string | undefined
  lang?: string | undefined
  metadata?: Record<string, unknown> | undefined
  timestamp?: string | undefined
}

export interface N8nDispatchResult {
  sent: boolean
  status?: number
  reason?: string
}

/**
 * Despacha un evento a n8n de manera asíncrona y no bloqueante.
 * Si N8N_WEBHOOK_URL no está configurado, omite el envío sin generar errores.
 */
export async function dispatchN8nEvent(payload: N8nEventPayload): Promise<N8nDispatchResult> {
  const webhookUrl = process.env.N8N_WEBHOOK_URL?.trim()

  if (!webhookUrl) {
    return { sent: false, reason: 'unconfigured' }
  }

  const enrichedPayload = {
    ...payload,
    timestamp: payload.timestamp || new Date().toISOString(),
    source: 'exepaginasweb',
    environment: process.env.NODE_ENV || 'production',
  }

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'User-Agent': 'ExePaginasWeb-Webhook/1.0',
    }

    const secret = process.env.N8N_WEBHOOK_SECRET?.trim()
    if (secret) {
      headers['X-Webhook-Secret'] = secret
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(enrichedPayload),
      signal: AbortSignal.timeout(4000), // Timeout defensivo de 4 segundos
    })

    if (!response.ok) {
      console.warn(`[n8n] Webhook retornó status ${response.status}`)
      return { sent: false, status: response.status, reason: 'http_error' }
    }

    return { sent: true, status: response.status }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.warn('[n8n] No se pudo enviar evento a n8n:', message)
    return { sent: false, reason: message }
  }
}

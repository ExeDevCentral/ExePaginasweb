/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Conector resiliente y auto-reparable para automatizaciones vía n8n & Serverless Fallback.
 */
import { sendEmail, ADMIN_EMAIL } from '@/lib/email/send'
import { n8nAutomationReceipt, n8nAdminNotification } from '@/lib/email/templates'

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
  phone?: string | undefined
  message?: string | undefined
  lang?: string | undefined
  metadata?: Record<string, unknown> | undefined
  timestamp?: string | undefined
}

export interface N8nDispatchResult {
  sent: boolean
  status?: number
  reason?: string
  healed?: boolean
  fallbackExecuted?: boolean
}

/**
 * Intenta reactivar workflows en n8n mediante la API pública de n8n
 * si se dispone de N8N_API_KEY y la URL de n8n.
 */
async function tryAutoActivateN8nWorkflow(): Promise<boolean> {
  const apiKey = process.env.N8N_API_KEY?.trim()
  const webhookUrl = process.env.N8N_WEBHOOK_URL?.trim()
  if (!apiKey || !webhookUrl) return false

  try {
    const urlObj = new URL(webhookUrl)
    const baseUrl = `${urlObj.protocol}//${urlObj.host}`
    const headers = {
      'X-N8N-API-KEY': apiKey,
      'Content-Type': 'application/json',
    }

    // 1. Listar workflows
    const listRes = await fetch(`${baseUrl}/api/v1/workflows?limit=50`, {
      headers,
      signal: AbortSignal.timeout(4000),
    })
    if (!listRes.ok) return false

    const listData = (await listRes.json()) as {
      data?: Array<{ id: string; name: string; active: boolean }>
    }
    const workflows = listData?.data || []

    for (const wf of workflows) {
      if (!wf.active) {
        // Reactivar workflow
        const actRes = await fetch(`${baseUrl}/api/v1/workflows/${wf.id}/activate`, {
          method: 'POST',
          headers,
          signal: AbortSignal.timeout(4000),
        })
        if (actRes.ok) {
          console.log(
            `[n8n-autoheal] ✅ Workflow ${wf.name} (${wf.id}) reactivado automáticamente vía n8n API.`
          )
          return true
        }
      }
    }
  } catch (err) {
    console.warn('[n8n-autoheal] No se pudo reactivar workflow automáticamente:', err)
  }
  return false
}

/**
 * Motor Serverless Fallback 100% Gratuito:
 * Si n8n Cloud está desactivado, dormido o sin créditos, este motor procesa
 * la automatización directamente en Next.js, notificando al usuario por Resend
 * y al Administrador sin perder ningún cliente ni requerir pagos.
 */
export async function executeServerlessAutomationFallback(
  payload: N8nEventPayload
): Promise<boolean> {
  try {
    const ticketId =
      payload.ticketId || `EXE-N8N-${Date.now().toString(36).toUpperCase().slice(-5)}`
    const clientEmail = payload.email?.trim()
    const clientPhone = payload.phone?.trim()
    const clientName = payload.name?.trim() || 'Cliente'
    const automationType = String(payload.metadata?.automationType || 'cotizacion_express')
    const details = payload.message || ''
    const lang = payload.lang || 'es'

    const emailTasks: Promise<unknown>[] = []

    // 1. Notificación instantánea al administrador (con escape HTML estricto)
    emailTasks.push(
      sendEmail({
        to: ADMIN_EMAIL,
        replyTo: clientEmail || ADMIN_EMAIL,
        subject: `[${ticketId}] ⚡ Automatización en Vivo: ${automationType} (${clientName})`,
        html: n8nAdminNotification({
          name: clientName,
          email: clientEmail,
          phone: clientPhone,
          automationType,
          details,
          ticketId,
          dispatchedToN8n: false,
        }),
      }).catch((e) => {
        console.warn('[n8n-fallback] Error enviando email a admin:', e)
      })
    )

    // 2. Si el cliente dejó su email, enviarle el comprobante interactivo de automatización
    if (clientEmail && clientEmail.includes('@') && process.env.RESEND_API_KEY) {
      emailTasks.push(
        sendEmail({
          to: clientEmail,
          replyTo: ADMIN_EMAIL,
          subject:
            lang === 'en'
              ? `⚡ Automated Workflow [Ticket: ${ticketId}] - ExePaginasWeb`
              : `⚡ Automatización Ejecutada [Ticket: ${ticketId}] - ExePaginasWeb`,
          html: n8nAutomationReceipt({
            name: clientName,
            email: clientEmail,
            automationType,
            details,
            ticketId,
            engineMode: 'serverless_free',
            lang,
          }),
        }).catch((e) => {
          console.warn('[n8n-fallback] Error enviando recibo a cliente:', e)
        })
      )
    }

    await Promise.allSettled(emailTasks)
    return true
  } catch (err) {
    console.error('[n8n-fallback] Error en motor serverless:', err)
    return false
  }
}

/**
 * Despacha un evento a n8n de manera asíncrona y no bloqueante.
 * Si N8N_WEBHOOK_URL no está configurado, omite el envío sin generar errores.
 * Si el webhook retorna 404 (desactivado), intenta auto-sanarlo vía API.
 */
export async function dispatchN8nEvent(payload: N8nEventPayload): Promise<N8nDispatchResult> {
  const webhookUrl = process.env.N8N_WEBHOOK_URL?.trim()

  if (!webhookUrl) {
    // Si no hay n8n configurado pero es un trigger de automatización, ejecutar motor serverless
    if (payload.event === 'automation.trigger') {
      await executeServerlessAutomationFallback(payload)
      return { sent: false, reason: 'unconfigured', fallbackExecuted: true }
    }
    return { sent: false, reason: 'unconfigured' }
  }

  const enrichedPayload = {
    ...payload,
    timestamp: payload.timestamp || new Date().toISOString(),
    source: 'exepaginasweb',
    environment: process.env.NODE_ENV || 'production',
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'User-Agent': 'ExePaginasWeb-Webhook/1.0',
  }

  const secret = process.env.N8N_WEBHOOK_SECRET?.trim()
  if (secret) {
    headers['X-Webhook-Secret'] = secret
  }

  const postToUrl = async (url: string) => {
    return await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(enrichedPayload),
      signal: AbortSignal.timeout(4000), // Timeout defensivo de 4 segundos
    })
  }

  try {
    let response = await postToUrl(webhookUrl)

    // Si n8n retorna 404 (workflow inactivo o desregistrado)
    if (response.status === 404) {
      console.warn(
        '[n8n] Webhook retornó 404 (workflow desactivado). Intentando auto-activación...'
      )
      const healed = await tryAutoActivateN8nWorkflow()
      if (healed) {
        // Reintentar tras auto-activación
        response = await postToUrl(webhookUrl)
        if (response.ok) {
          return { sent: true, status: response.status, healed: true }
        }
      }
    }

    if (!response.ok) {
      console.warn(`[n8n] Webhook retornó status ${response.status}`)
      // En caso de fallo de n8n en un trigger de automatización, disparar motor serverless de respaldo
      if (payload.event === 'automation.trigger') {
        const fallbackExecuted = await executeServerlessAutomationFallback(payload)
        return { sent: false, status: response.status, reason: 'http_error', fallbackExecuted }
      }
      return { sent: false, status: response.status, reason: 'http_error' }
    }

    return { sent: true, status: response.status }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.warn('[n8n] No se pudo enviar evento a n8n:', message)
    if (payload.event === 'automation.trigger') {
      const fallbackExecuted = await executeServerlessAutomationFallback(payload)
      return { sent: false, reason: message, fallbackExecuted }
    }
    return { sent: false, reason: message }
  }
}

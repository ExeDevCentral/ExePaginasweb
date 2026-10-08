function _optionalChain(ops) {
  let lastAccessLHS = undefined
  let value = ops[0]
  let i = 1
  while (i < ops.length) {
    const op = ops[i]
    const fn = ops[i + 1]
    i += 2
    if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) {
      return undefined
    }
    if (op === 'access' || op === 'optionalAccess') {
      lastAccessLHS = value
      value = fn(value)
    } else if (op === 'call' || op === 'optionalCall') {
      value = fn((...args) => value.call(lastAccessLHS, ...args))
      lastAccessLHS = undefined
    }
  }
  return value
} /**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Conector asíncrono para automatizaciones externas vía n8n Webhook.
 */

/**
 * Despacha un evento a n8n de manera asíncrona y no bloqueante.
 * Si N8N_WEBHOOK_URL no está configurado, omite el envío sin generar errores.
 */
export async function dispatchN8nEvent(payload) {
  const webhookUrl = _optionalChain([
    process,
    'access',
    (_) => _.env,
    'access',
    (_2) => _2.N8N_WEBHOOK_URL,
    'optionalAccess',
    (_3) => _3.trim,
    'call',
    (_4) => _4(),
  ])

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
    const headers = {
      'Content-Type': 'application/json',
      'User-Agent': 'ExePaginasWeb-Webhook/1.0',
    }

    const secret = _optionalChain([
      process,
      'access',
      (_5) => _5.env,
      'access',
      (_6) => _6.N8N_WEBHOOK_SECRET,
      'optionalAccess',
      (_7) => _7.trim,
      'call',
      (_8) => _8(),
    ])
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

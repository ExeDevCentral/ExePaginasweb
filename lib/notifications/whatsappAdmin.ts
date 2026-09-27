/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Servicio de alertas directas por WhatsApp para el administrador (100% Gratis vía CallMeBot).
 */

export interface WhatsAppAdminAlertParams {
  title: string
  name?: string | undefined
  email?: string | undefined
  message?: string | undefined
  ticketId?: string | undefined
  plan?: string | undefined
  amount?: string | number | undefined
}

export async function sendWhatsAppAdminAlert(params: WhatsAppAdminAlertParams) {
  const apiKey = process.env.CALLMEBOT_API_KEY
  // Número de teléfono del administrador (por defecto 5493416874786)
  const phone = process.env.CALLMEBOT_PHONE || '5493416874786'

  // Si no está configurada la API key, se omite silenciosamente para no bloquear nada
  if (!apiKey) {
    return { ok: false, reason: 'CALLMEBOT_API_KEY no configurada' }
  }

  try {
    const lines = [
      `🚨 *${params.title}*`,
      params.ticketId ? `🎟️ *Ticket:* ${params.ticketId}` : null,
      params.name ? `👤 *Nombre:* ${params.name}` : null,
      params.email ? `📧 *Email:* ${params.email}` : null,
      params.plan ? `📦 *Plan:* ${params.plan}` : null,
      params.amount ? `💰 *Monto:* $${params.amount} USD` : null,
      params.message ? `💬 *Mensaje:* ${params.message.slice(0, 280)}` : null,
      `⏰ ${new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}`,
    ].filter(Boolean)

    const text = encodeURIComponent(lines.join('\n'))
    const url = `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${text}&apikey=${apiKey}`

    const res = await fetch(url, {
      method: 'GET',
      signal: AbortSignal.timeout(6000),
    })

    if (!res.ok) {
      console.warn(`[whatsapp-alert] CallMeBot respondió con estado: ${res.status}`)
      return { ok: false, status: res.status }
    }

    console.log(`[whatsapp-alert] ✅ Notificación enviada a WhatsApp admin (${phone})`)
    return { ok: true }
  } catch (err) {
    console.warn('[whatsapp-alert] Error enviando alerta de WhatsApp:', err)
    return { ok: false, error: err }
  }
}

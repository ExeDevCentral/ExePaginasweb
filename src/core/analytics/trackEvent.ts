/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
'use client'

import { track } from '@vercel/analytics'

export type AnalyticsEventName =
  | 'hero_cta_demo_clicked'
  | 'hero_cta_portfolio_clicked'
  | 'hero_cta_contact_clicked'
  | 'contact_form_submitted'
  | 'contact_whatsapp_clicked'
  | 'chat_message_sent'
  | 'chat_widget_opened'
  | 'store_checkout_started'
  | 'cotizador_plan_selected'
  | 'pricing_section_viewed'
  | 'pricing_plan_clicked'
  | 'demo_interactive_used'

export interface TrackEventOptions {
  flags?: string[]
}

/**
 * Obtiene o inicializa un ID de sesión efímero para correlacionar eventos sin rastrear datos personales.
 */
function getSessionId(): string | undefined {
  try {
    if (typeof window === 'undefined') return undefined
    let sid = window.sessionStorage.getItem('epw_sid')
    if (!sid) {
      sid = 'sid_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now().toString(36)
      window.sessionStorage.setItem('epw_sid', sid)
    }
    return sid
  } catch {
    return undefined
  }
}

/**
 * Verifica si las métricas están deshabilitadas para este navegador (ej: visitas del dueño).
 */
export function isTrackingDisabled(): boolean {
  try {
    if (typeof window === 'undefined') return false
    return (
      window.localStorage.getItem('va-disable') === '1' ||
      window.localStorage.getItem('va-disable') === 'true'
    )
  } catch {
    return false
  }
}

/**
 * Permite deshabilitar o habilitar el tracking localmente (para que Exequiel excluya sus propios dispositivos).
 */
export function setTrackingDisabled(disabled: boolean): void {
  try {
    if (typeof window === 'undefined') return
    if (disabled) {
      window.localStorage.setItem('va-disable', '1')
    } else {
      window.localStorage.removeItem('va-disable')
    }
  } catch {
    // Silencioso ante restricciones de storage
  }
}

/**
 * Registra eventos en Supabase (100% gratis, sin límite de Vercel Pro)
 * y en Vercel Web Analytics.
 * Excluye automáticamente si va-disable está activo en el navegador.
 */
export function trackEvent(
  name: AnalyticsEventName,
  properties?: Record<string, string | number | boolean | null>,
  options?: TrackEventOptions
) {
  try {
    if (typeof window === 'undefined') return

    // 1. Si el usuario activó la exclusión (ej. Exequiel testeando su web), no registrar
    if (isTrackingDisabled()) {
      return
    }

    // 2. Vercel Web Analytics
    const trackOptions =
      options?.flags && options.flags.length > 0 ? { flags: options.flags } : undefined
    track(name, properties, trackOptions)

    // 3. Supabase Analytics (Endpoint propio gratuito)
    const payload = JSON.stringify({
      event_name: name,
      properties: properties || {},
      page_path: window.location.pathname,
      referrer: document.referrer || undefined,
      session_id: getSessionId(),
    })

    if (navigator.sendBeacon) {
      const blob = new Blob([payload], { type: 'application/json' })
      navigator.sendBeacon('/api/analytics/event', blob)
    } else {
      fetch('/api/analytics/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        keepalive: true,
      }).catch(() => {})
    }
  } catch {
    // Silencioso ante bloqueadores de anuncios o entornos sin analytics
  }
}

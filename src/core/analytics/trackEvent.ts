'use client'

import { track } from '@vercel/analytics'

export type AnalyticsEventName =
  | 'hero_cta_demo_clicked'
  | 'hero_cta_contact_clicked'
  | 'contact_form_submitted'
  | 'contact_whatsapp_clicked'
  | 'chat_message_sent'
  | 'store_checkout_started'
  | 'cotizador_plan_selected'
  | 'demo_interactive_used'

export interface TrackEventOptions {
  flags?: string[]
}

/**
 * Registra eventos personalizados en Vercel Web Analytics con soporte de Feature Flags y A/B Testing.
 * Seguro ante bloqueadores de anuncios (adblockers): nunca arroja errores que interrumpan la experiencia de usuario.
 */
export function trackEvent(
  name: AnalyticsEventName,
  properties?: Record<string, string | number | boolean | null>,
  options?: TrackEventOptions
) {
  try {
    if (typeof window === 'undefined') return

    const trackOptions =
      options?.flags && options.flags.length > 0 ? { flags: options.flags } : undefined

    track(name, properties, trackOptions)
  } catch {
    // Silencioso ante bloqueadores de anuncios o entornos sin analytics
  }
}

/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
import posthog from 'posthog-js'

export const posthogClient = posthog

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com'

export const posthogEnabled = Boolean(
  POSTHOG_KEY && process.env.NEXT_PUBLIC_POSTHOG_ENABLED === 'true'
)

if (posthogEnabled && typeof window !== 'undefined') {
  posthogClient.init(POSTHOG_KEY as string, {
    api_host: POSTHOG_HOST,
    person_profiles: 'identified_only',
    capture_pageview: false,
    capture_pageleave: false,
  })
}

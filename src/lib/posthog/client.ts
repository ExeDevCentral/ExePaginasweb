/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
import posthog from 'posthog-js'
import { isTrackingDisabled } from '@/core/analytics/trackEvent'

export const posthogClient = posthog

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com'

export const posthogEnabled = Boolean(
  POSTHOG_KEY && process.env.NEXT_PUBLIC_POSTHOG_ENABLED !== 'false'
)

function resolvePostHogUiHost(apiHost: string): string {
  if (apiHost.includes('eu.i.posthog.com')) return 'https://eu.posthog.com'
  if (apiHost.includes('us.i.posthog.com')) return 'https://us.posthog.com'
  return apiHost
}

let initialized = false

export function initPostHogClient(): void {
  if (initialized || !posthogEnabled || typeof window === 'undefined') return
  initialized = true

  posthogClient.init(POSTHOG_KEY as string, {
    api_host: '/ingest',
    ui_host: resolvePostHogUiHost(POSTHOG_HOST),
    person_profiles: 'identified_only',
    capture_pageview: false,
    capture_pageleave: true,
    capture_exceptions: true,
    loaded: (ph) => {
      if (isTrackingDisabled()) {
        ph.opt_out_capturing()
      }
    },
  })
}

initPostHogClient()

export function identifyPostHogUser(user: { id: string; email?: string }): void {
  if (!posthogEnabled || typeof window === 'undefined' || isTrackingDisabled()) return
  posthogClient.identify(user.id, user.email ? { email: user.email } : undefined)
}

export function resetPostHogUser(): void {
  if (!posthogEnabled || typeof window === 'undefined') return
  posthogClient.reset()
}

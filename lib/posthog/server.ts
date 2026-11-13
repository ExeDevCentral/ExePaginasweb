/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
import { PostHog } from 'posthog-node'
import { waitUntil } from '@vercel/functions'

const POSTHOG_KEY = process.env.POSTHOG_API_KEY || process.env.NEXT_PUBLIC_POSTHOG_KEY
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com'

export const posthogServerEnabled = Boolean(
  POSTHOG_KEY && process.env.NEXT_PUBLIC_POSTHOG_ENABLED !== 'false'
)

/**
 * Crea una instancia de PostHog Node configurada para funciones serverless de Vercel
 * (flush inmediato sin batching diferido).
 */
export function createPostHogServerClient(): PostHog | null {
  if (!posthogServerEnabled || !POSTHOG_KEY) return null

  return new PostHog(POSTHOG_KEY, {
    host: POSTHOG_HOST,
    flushAt: 1,
    flushInterval: 0,
  })
}

/**
 * Ejecuta una promesa en segundo plano usando `waitUntil` de Vercel Functions
 * para no bloquear la respuesta HTTP y evitar que Vercel congele el runtime antes de tiempo.
 */
export function runInBackground(promise: Promise<unknown>): void {
  const safePromise = promise.catch((err) => {
    console.warn('[vercel:background] Background task failed:', err)
  })

  try {
    waitUntil(safePromise)
  } catch {
    // Fuera de Vercel (local dev, tests), la promesa continúa ejecutándose normalmente
  }
}

export interface ServerCaptureInput {
  distinctId: string
  event: string
  properties?: Record<string, unknown>
}

/**
 * Envía un evento a PostHog desde el servidor sin bloquear la respuesta de la ruta API.
 */
export function captureServerEvent({ distinctId, event, properties }: ServerCaptureInput): void {
  const client = createPostHogServerClient()
  if (!client) return

  runInBackground(
    (async () => {
      try {
        client.capture({
          distinctId,
          event,
          ...(properties ? { properties } : {}),
        })
      } finally {
        await client.shutdown()
      }
    })()
  )
}

/**
 * Envía una excepción a PostHog desde el servidor sin bloquear la respuesta.
 */
export function captureServerException(
  error: unknown,
  distinctId = 'server',
  properties?: Record<string, unknown>
): void {
  const client = createPostHogServerClient()
  if (!client) return

  runInBackground(
    (async () => {
      try {
        client.captureException(error, distinctId, properties)
      } finally {
        await client.shutdown()
      }
    })()
  )
}

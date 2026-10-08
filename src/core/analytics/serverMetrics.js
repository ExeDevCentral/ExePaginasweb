/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Métricas de servidor para Vercel Functions / Observability.
 */
import { metric as vercelMetric } from '@vercel/functions'

/**
 * Reporta una métrica personalizada para la invocación actual de la función de Vercel.
 * Aislado contra errores fuera de producción (local, CI o tests).
 *
 * @param name Nombre de la métrica (ej. 'query.duration_ms', 'api.latency_ms')
 * @param value Valor numérico de la métrica
 * @param tags Tags opcionales con pares clave-valor en string (ej. { plan: 'pro', endpoint: 'chat' })
 *
 * @example
 * ```ts
 * import { trackServerMetric } from '@/core/analytics/serverMetrics'
 *
 * trackServerMetric('query.duration_ms', 100, { plan: 'pro' })
 * ```
 */
export function trackServerMetric(name, value, tags) {
  try {
    vercelMetric(name, value, tags)
  } catch (e) {
    // Silencioso en entornos fuera de Vercel o sin contexto de serverless function
  }
}

// Re-export directo de @vercel/functions para uso idiomático
export { metric } from '@vercel/functions'

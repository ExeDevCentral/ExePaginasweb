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
 * Prohibida su reproducción total o parcial sin autorización.
 */
;('use client')

import { track } from '@vercel/analytics'

/**
 * Registra eventos personalizados en Vercel Web Analytics con soporte de Feature Flags y A/B Testing.
 * Seguro ante bloqueadores de anuncios (adblockers): nunca arroja errores que interrumpan la experiencia de usuario.
 */
export function trackEvent(name, properties, options) {
  try {
    if (typeof window === 'undefined') return

    const trackOptions =
      _optionalChain([options, 'optionalAccess', (_) => _.flags]) && options.flags.length > 0
        ? { flags: options.flags }
        : undefined

    track(name, properties, trackOptions)
  } catch (e) {
    // Silencioso ante bloqueadores de anuncios o entornos sin analytics
  }
}

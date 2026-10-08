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
/**
 * Hook para Intersection Observer — Detectar cuándo un elemento es visible
 *
 * Utilizar para lazy-load componentes 3D costosos
 */

;('use client')

import { useEffect, useState } from 'react'

export function useIntersectionObserver(ref, options = {}) {
  const [isVisible, setIsVisible] = useState(false)
  const { once = true, onIntersect, ...observerOptions } = options

  useEffect(() => {
    if (!ref.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return
        if (entry.isIntersecting) {
          setIsVisible(true)
          _optionalChain([onIntersect, 'optionalCall', (_) => _()])

          if (once) {
            observer.unobserve(entry.target)
          }
        } else if (!once) {
          setIsVisible(false)
        }
      },
      {
        threshold: 0.1,
        ...observerOptions,
      }
    )

    observer.observe(ref.current)

    return () => observer.disconnect()
  }, [ref, once, onIntersect, observerOptions])

  return isVisible
}

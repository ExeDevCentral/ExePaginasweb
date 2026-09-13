/**
 * Hook para Intersection Observer — Detectar cuándo un elemento es visible
 *
 * Utilizar para lazy-load componentes 3D costosos
 */

'use client'

import { RefObject, useEffect, useState } from 'react'

export interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  once?: boolean // Solo disparar una vez
  onIntersect?: () => void
}

export function useIntersectionObserver<T extends HTMLElement>(
  ref: RefObject<T>,
  options: UseIntersectionObserverOptions = {}
): boolean {
  const [isVisible, setIsVisible] = useState(false)
  const { once = true, onIntersect, ...observerOptions } = options

  useEffect(() => {
    if (!ref.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          onIntersect?.()

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

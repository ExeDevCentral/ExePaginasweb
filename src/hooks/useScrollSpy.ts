import { useState, useEffect, useCallback } from 'react'

interface UseScrollSpyOptions {
  /** Offset desde el top para considerar la sección como activa (en px) */
  offset?: number
  /** Si es true, usa requestAnimationFrame para mejor rendimiento */
  useRAF?: boolean
}

/**
 * Hook personalizado para detectar qué sección está visible en el scroll
 * @param sectionIds - Array de IDs de secciones a monitorear
 * @param options - Opciones de configuración
 * @returns El ID de la sección actualmente activa
 * 
 * @example
 * ```tsx
 * const activeSection = useScrollSpy(['home', 'products', 'features', 'contact'])
 * ```
 */
export function useScrollSpy(
  sectionIds: string[],
  options: UseScrollSpyOptions = {}
): string {
  const { offset = 120, useRAF = true } = options
  const [activeId, setActiveId] = useState<string>(sectionIds[0] || '')

  const updateActiveSection = useCallback(() => {
    const scrollY = window.scrollY
    let current: string = sectionIds[0] || ''

    for (const id of sectionIds) {
      const element = document.getElementById(id)
      if (!element) continue

      const elementTop = element.getBoundingClientRect().top + scrollY
      if (scrollY + offset >= elementTop) {
        current = id
      }
    }

    setActiveId(current)
  }, [sectionIds, offset])

  useEffect(() => {
    let rafId: number
    let ticking = false

    const handleScroll = () => {
      if (useRAF) {
        if (!ticking) {
          rafId = requestAnimationFrame(() => {
            updateActiveSection()
            ticking = false
          })
          ticking = true
        }
      } else {
        updateActiveSection()
      }
    }

    // Ejecutar inicialmente
    updateActiveSection()

    // Escuchar eventos de scroll con passive: true para mejor rendimiento
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
      if (rafId) {
        cancelAnimationFrame(rafId)
      }
    }
  }, [updateActiveSection, useRAF])

  return activeId
}
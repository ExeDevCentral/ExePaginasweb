import { useState, useEffect, useRef } from 'react'

interface UseScrollSpyOptions {
  /** Offset desde el top para considerar la sección como activa (en px) */
  offset?: number
  /** Si es true, usa requestAnimationFrame para mejor rendimiento */
  useRAF?: boolean
}

/**
 * Hook de alto rendimiento para detectar qué sección está visible en el scroll.
 * Optimizado para evitar recálculos excesivos de layout (layout thrashing) y re-renders innecesarios.
 */
export function useScrollSpy(sectionIds: string[], options: UseScrollSpyOptions = {}): string {
  const { offset = 120, useRAF = true } = options
  const [activeId, setActiveId] = useState<string>(sectionIds[0] || '')
  const activeIdRef = useRef(activeId)
  activeIdRef.current = activeId

  // Referencia estable de los IDs para evitar recalcular listeners si la referencia del array cambia
  const idsKey = sectionIds.join(',')

  useEffect(() => {
    const ids = idsKey.split(',').filter(Boolean)
    if (ids.length === 0) return

    let rafId: number | null = null
    let isTicking = false

    const updateActiveSection = () => {
      const scrollY = window.scrollY
      let current: string = ids[0] || ''

      for (let i = 0; i < ids.length; i++) {
        const id = ids[i]
        const element = document.getElementById(id)
        if (!element) continue

        // Usar offsetTop o getBoundingClientRect
        const rect = element.getBoundingClientRect()
        const elementTop = rect.top + scrollY
        if (scrollY + offset >= elementTop) {
          current = id
        }
      }

      // Solo actualizar estado si realmente cambió la sección activa
      if (current !== activeIdRef.current) {
        activeIdRef.current = current
        setActiveId(current)
      }
    }

    const handleScroll = () => {
      if (useRAF) {
        if (!isTicking) {
          isTicking = true
          rafId = requestAnimationFrame(() => {
            updateActiveSection()
            isTicking = false
          })
        }
      } else {
        updateActiveSection()
      }
    }

    // Ejecución inicial
    updateActiveSection()

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
      if (rafId !== null) {
        cancelAnimationFrame(rafId)
      }
    }
  }, [idsKey, offset, useRAF])

  return activeId
}

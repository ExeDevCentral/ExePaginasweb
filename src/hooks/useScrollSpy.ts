import { useState, useEffect, useRef } from 'react'

interface UseScrollSpyOptions {
  /** Offset desde el top para considerar la sección como activa (en px) */
  offset?: number
  /** Si es true, usa requestAnimationFrame para mejor rendimiento */
  useRAF?: boolean
}

/**
 * Hook de alto rendimiento para detectar qué sección está visible en el scroll.
 * Cachea las posiciones de las secciones para eliminar layout thrashing (getBoundingClientRect)
 * durante el scroll activo.
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
    let cachedTops: { id: string; top: number }[] = []

    const recalculateTops = () => {
      const scrollY = window.scrollY
      cachedTops = ids
        .map((id) => {
          const el = document.getElementById(id)
          if (!el) return null
          return { id, top: el.getBoundingClientRect().top + scrollY }
        })
        .filter((item): item is { id: string; top: number } => item !== null)
    }

    recalculateTops()

    const updateActiveSection = () => {
      if (cachedTops.length === 0) {
        recalculateTops()
      }
      const scrollPosition = window.scrollY + offset
      let current = ids[0] || ''

      for (const item of cachedTops) {
        if (scrollPosition >= item.top) {
          current = item.id
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

    const handleResize = () => {
      recalculateTops()
      handleScroll()
    }

    // Ejecución inicial
    updateActiveSection()

    // Recalcular posiciones tras renderizados diferidos
    const refreshTimer = setTimeout(recalculateTops, 1200)

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleResize, { passive: true })

    return () => {
      clearTimeout(refreshTimer)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
      if (rafId !== null) {
        cancelAnimationFrame(rafId)
      }
    }
  }, [idsKey, offset, useRAF])

  return activeId
}

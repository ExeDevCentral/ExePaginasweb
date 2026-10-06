/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Hook de scroll con histéresis y estiramiento por velocidad para la Liquid Island.
 */
'use client'

import { useState, useRef, useEffect } from 'react'
import {
  useScroll,
  useVelocity,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
  type MotionValue,
} from 'framer-motion'

export type NavState = 'expanded' | 'compact'

export interface UseNavScrollOptions {
  /**
   * Si es true, la barra también se expande al subir a mitad de página.
   * Por defecto: false (solo se expande al llegar arriba scrollY < 24).
   */
  expandOnScrollUp?: boolean
  /** Umbral superior para entrar en modo compact (px). Por defecto 80. */
  compactThreshold?: number
  /** Umbral inferior para volver a modo expanded (px). Por defecto 24. */
  expandedThreshold?: number
}

export interface UseNavScrollReturn {
  state: NavState
  isCompact: boolean
  isExpanded: boolean
  scrollY: MotionValue<number>
  scrollVelocity: MotionValue<number>
  scrollProgress: MotionValue<number>
  skewX: MotionValue<number>
  scaleY: MotionValue<number>
  reduceMotion: boolean
}

export function useNavScroll({
  expandOnScrollUp = false,
  compactThreshold = 80,
  expandedThreshold = 24,
}: UseNavScrollOptions = {}): UseNavScrollReturn {
  const [navState, setNavState] = useState<NavState>('expanded')
  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)
  const reduceMotion = Boolean(useReducedMotion())

  // Progreso continuo de 0 a 1 en el tramo inicial de scroll (0 a 300px)
  const scrollProgress = useTransform(scrollY, [0, 300], [0, 1], { clamp: true })

  // Enfoque de alta ingeniería (estilo Linear/Vercel):
  // Cero deformaciones elásticas de gelatina para máxima solidez arquitectónica
  const finalSkewX = useTransform(scrollY, () => 0)
  const finalScaleY = useTransform(scrollY, () => 1)

  const lastScrollYRef = useRef(0)

  // Escucha de eventos de scroll con histéresis estricta para evitar parpadeos
  useMotionValueEvent(scrollY, 'change', (latest) => {
    const prev = lastScrollYRef.current
    const delta = latest - prev
    lastScrollYRef.current = latest

    if (navState === 'expanded') {
      if (latest > compactThreshold) {
        setNavState('compact')
      }
    } else {
      // Estado compact
      if (latest < expandedThreshold) {
        // Al volver y llegar al tope (< 24px)
        setNavState('expanded')
      } else if (expandOnScrollUp && delta < -18 && latest > 120) {
        // Flag opcional de expansión en scroll up a mitad de página
        setNavState('expanded')
      }
    }
  })

  // Sincronización inmediata al montar o refrescar con scroll previo
  useEffect(() => {
    if (typeof window === 'undefined') return
    const currentY = window.scrollY
    lastScrollYRef.current = currentY
    if (currentY > compactThreshold) {
      setNavState('compact')
    } else {
      setNavState('expanded')
    }
  }, [compactThreshold])

  const isCompact = navState === 'compact'

  return {
    state: navState,
    isCompact,
    isExpanded: !isCompact,
    scrollY,
    scrollVelocity,
    scrollProgress,
    skewX: finalSkewX,
    scaleY: finalScaleY,
    reduceMotion,
  }
}

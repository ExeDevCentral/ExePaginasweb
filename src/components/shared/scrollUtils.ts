/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
import type Lenis from 'lenis'

let globalLenis: Lenis | null = null

export function setGlobalLenis(instance: Lenis | null) {
  globalLenis = instance
}

export function getGlobalLenis() {
  return globalLenis
}

export function resetScrollToTop() {
  window.scrollTo(0, 0)
  globalLenis?.scrollTo(0, { immediate: true })
}

export function navigateToSection(
  targetId: string,
  options?: {
    offset?: number
  }
) {
  const cleanId = targetId.replace(/^#/, '')
  const el = document.getElementById(cleanId)
  if (!el) {
    if (typeof window !== 'undefined') {
      window.location.href = '/#' + cleanId
    }
    return false
  }

  const offset = options?.offset ?? 72
  const elementPosition = el.getBoundingClientRect().top
  const offsetPosition = elementPosition + window.pageYOffset - offset

  if (globalLenis) {
    globalLenis.scrollTo(offsetPosition, { duration: 0.65 })
  } else {
    window.scrollTo({ top: offsetPosition, behavior: 'smooth' })
  }

  return true
}

export function scrollToElement(
  target: string | HTMLElement,
  options?: Parameters<Lenis['scrollTo']>[1]
) {
  if (globalLenis) {
    globalLenis.scrollTo(target, { duration: 0.65, ...options })
  } else {
    const el = typeof target === 'string' ? document.querySelector(target) : target
    el?.scrollIntoView({ behavior: 'smooth' })
  }
}

/**
 * Obtiene todas las secciones principales identificables en la página
 */
export function getLandingSections(): HTMLElement[] {
  if (typeof document === 'undefined') return []
  return Array.from(document.querySelectorAll<HTMLElement>('main section[id], section[id]'))
}

/**
 * Navega suavemente a la siguiente o anterior sección usando Lenis o scroll nativo
 */
export function navigateSection(direction: 1 | -1, offset = 80) {
  const sections = getLandingSections()
  if (sections.length === 0) return

  const currentScrollY = window.scrollY
  let currentIndex = 0
  let minDistance = Infinity

  for (let i = 0; i < sections.length; i++) {
    const sec = sections[i]
    if (!sec) continue
    const top = sec.offsetTop - offset
    const dist = Math.abs(currentScrollY - top)
    if (dist < minDistance) {
      minDistance = dist
      currentIndex = i
    }
  }

  const nextIndex = Math.min(Math.max(currentIndex + direction, 0), sections.length - 1)
  const targetSection = sections[nextIndex]
  if (targetSection) {
    const targetTop = Math.max(0, targetSection.offsetTop - offset)
    if (globalLenis) {
      globalLenis.scrollTo(targetTop, { duration: 0.75 })
    } else {
      window.scrollTo({ top: targetTop, behavior: 'smooth' })
    }
  }
}

/**
 * Navegación suave universal de alta ingeniería con compensación exacta de offset para el Navbar
 * Por defecto offset = -88px para despejar el LiquidIslandNavbar.
 */
export function smoothScrollTo(targetSelectorOrY: string | number, offset = -88) {
  if (typeof window === 'undefined') return

  if (typeof targetSelectorOrY === 'number') {
    if (globalLenis) {
      globalLenis.scrollTo(targetSelectorOrY, { offset, duration: 0.85 })
    } else {
      window.scrollTo({ top: Math.max(0, targetSelectorOrY + offset), behavior: 'smooth' })
    }
    return
  }

  const cleanId = targetSelectorOrY.startsWith('#') ? targetSelectorOrY : `#${targetSelectorOrY}`
  const el = typeof document !== 'undefined' ? document.querySelector(cleanId) : null

  if (el) {
    if (globalLenis) {
      globalLenis.scrollTo(el as HTMLElement, { offset, duration: 0.85 })
    } else {
      const top = (el as HTMLElement).getBoundingClientRect().top + (window.scrollY || 0) + offset
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
    }
  } else {
    window.location.href = `/${cleanId}`
  }
}

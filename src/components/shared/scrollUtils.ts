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

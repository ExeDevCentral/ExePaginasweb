/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const PAGES = [
  { path: '/', name: 'home' },
  { path: '/cotizador', name: 'cotizador' },
  { path: '/tienda', name: 'tienda' },
  { path: '/login', name: 'login' },
  { path: '/terminos', name: 'terminos' },
  { path: '/privacidad', name: 'privacidad' },
]

// Auditoría de contraste complementaria a axe. axe-core no parsea los colores
// modernos que emite Tailwind v4 (`oklab(...)`/`lab(...)` y `color-mix`), por eso
// `color-contrast` está deshabilitado arriba. Este scanner lee los colores
// COMPUTADOS en el navegador: cuando el valor es `rgb(...)`/`rgba(...)` real lo
// audita con las reglas WCAG 2.1 (AA). Los valores `lab()/oklab()/color()` se
// omiten de forma explícita (mismo motivo que axe), evitando falsos positivos
// pero garantizando que un contraste genuino y representable en rgb no pase
// desapercibido (p.ej. un color slate grisáceo sobre fondo oscuro).
async function collectContrastFailures(page: import('@playwright/test').Page) {
  return page.evaluate(() => {
    const parseRgb = (color: string): number[] | null => {
      const m = /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?\s*\)$/.exec(color)
      if (!m) return null
      if (m[4] !== undefined && Number(m[4]) < 1) return null
      return [Number(m[1]), Number(m[2]), Number(m[3])]
    }

    const luminance = (rgb: number[]) => {
      const c = rgb.map((v) => {
        const s = v / 255
        return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
      })
      return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]
    }

    const contrastRatio = (a: number[], b: number[]) => {
      const la = luminance(a)
      const lb = luminance(b)
      const hi = Math.max(la, lb)
      const lo = Math.min(la, lb)
      return (hi + 0.05) / (lo + 0.05)
    }

    const effectiveBackground = (el: HTMLElement): number[] | null => {
      // Fondos con gradientes/imágenes no se pueden resolver como color plano:
      // usar el contenedor de atrás daría un contraste FALSO. Si cualquier
      // ancestro en la cadena define una imagen de fondo, no auditor este nodo.
      let node: HTMLElement | null = el
      while (node) {
        const nodeStyle = getComputedStyle(node)
        if (nodeStyle.backgroundImage !== 'none') return null
        const parsed = parseRgb(nodeStyle.backgroundColor)
        if (parsed) return parsed
        node = node.parentElement
      }
      return null
    }

    const failures: Array<{ selector: string; ratio: string; text: string }> = []
    const elements = Array.from(document.querySelectorAll<HTMLElement>('body *'))

    for (const el of elements) {
      const style = getComputedStyle(el)
      if (style.display === 'none' || style.visibility === 'hidden') continue
      const opacity = Number(style.opacity)
      if (opacity === 0 || (opacity > 0 && opacity < 1)) continue
      const rect = el.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) continue
      if (el.closest('[aria-hidden="true"]')) continue

      const hasDirectText = Array.from(el.childNodes).some(
        (node) => node.nodeType === Node.TEXT_NODE && Boolean((node.textContent ?? '').trim())
      )
      if (!hasDirectText) continue

      const fg = parseRgb(style.color)
      if (!fg) continue
      const bg = effectiveBackground(el)
      if (!bg) continue

      const fontSize = parseFloat(style.fontSize)
      const fontWeight = parseInt(style.fontWeight, 10) || 400
      const isLargeText = fontSize >= 24 || (fontSize >= 18.66 && fontWeight >= 700)
      const minRatio = isLargeText ? 3 : 4.5

      const actualRatio = contrastRatio(fg, bg)
      if (actualRatio < minRatio) {
        const firstClasses = String(el.className ?? '')
          .split(' ')
          .filter(Boolean)
          .slice(0, 2)
          .map((c) => `.${c}`)
          .join('')
        failures.push({
          selector: `${el.tagName.toLowerCase()}${el.id ? `#${el.id}` : ''}${firstClasses}`,
          ratio: actualRatio.toFixed(2),
          text: (el.textContent ?? '').trim().slice(0, 60),
        })
      }
    }

    return failures
  })
}

for (const { path, name } of PAGES) {
  test(`a11y: ${name} sin violaciones críticas o serias`, async ({ page }) => {
    await page.goto(path, { waitUntil: 'load' })
    await page.waitForTimeout(500)

    const results = await new AxeBuilder({ page })
      .options({
        rules: {
          // axe-core no soporta los colores modernos de Tailwind v4
          // (`oklch`/`lab` y `color-mix`): los parsea mal y reporta contrastes
          // falsos (fg blancos leídos como #404044, ratios de 1.4 donde el
          // cálculo real da ~6.7:1). La cobertura real de contraste la provee
          // `collectContrastFailures` más abajo (colores rgb computados).
          'color-contrast': { enabled: false },
        },
      })
      .analyze()

    const blocking = results.violations.filter(
      (violation) => violation.impact === 'critical' || violation.impact === 'serious'
    )

    const summary = blocking.map((violation) => ({
      id: violation.id,
      impact: violation.impact,
      help: violation.help,
      nodes: violation.nodes.map((node) => node.target.join(' ')),
    }))

    expect(
      summary,
      `Violaciones bloqueantes en /${name}:\n${JSON.stringify(summary, null, 2)}`
    ).toEqual([])

    const contrastFailures = await collectContrastFailures(page)
    expect(
      contrastFailures,
      `Contraste AA insuficiente en /${name} (colores rgb computados):\n${JSON.stringify(
        contrastFailures,
        null,
        2
      )}`
    ).toEqual([])
  })
}

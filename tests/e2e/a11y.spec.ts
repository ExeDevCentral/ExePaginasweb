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
          // cálculo real da ~6.7:1). Excluimos esa regla; el resto se audita.
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
  })
}

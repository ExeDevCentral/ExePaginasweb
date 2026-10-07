/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 *
 * new-modules.test.ts: Verificación unitaria y arquitectónica de los nuevos módulos:
 * LaserScrollBeam, CommandPalette, TelemetryHUD y MaterialIcon.
 */
import { describe, it, expect } from 'vitest'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import MaterialIcon from '../../src/components/ui/MaterialIcon'
import fs from 'node:fs'
import path from 'node:path'

describe('New Premium UI & Telemetry Modules Verification', () => {
  it('MaterialIcon genera marcado HTML con clases y estilos ópticos correctos', () => {
    const html = renderToStaticMarkup(
      React.createElement(MaterialIcon, {
        name: 'terminal',
        filled: true,
        weight: 600,
        opticalSize: 24,
        size: 20,
        className: 'text-cyan-400',
      })
    )

    expect(html).toContain('material-symbols-outlined')
    expect(html).toContain('terminal')
    expect(html).toContain('text-cyan-400')
    expect(html).toContain(
      'font-variation-settings:&#x27;FILL&#x27; 1, &#x27;wght&#x27; 600, &#x27;GRAD&#x27; 0, &#x27;opsz&#x27; 24'
    )
    expect(html).toContain('font-size:20px')
  })

  it('LaserScrollBeam implementa física spring sin transiciones de layout bruscas', () => {
    const beamPath = path.resolve(process.cwd(), 'src/components/layout/LaserScrollBeam.tsx')
    const content = fs.readFileSync(beamPath, 'utf-8')

    expect(content).toContain('useScroll')
    expect(content).toContain('useSpring')
    expect(content).toContain('stiffness: 140')
    expect(content).toContain('origin-left')
  })

  it('CommandPalette integra cmdk, búsqueda accesible y atajos de teclado', () => {
    const cmdkPath = path.resolve(process.cwd(), 'src/components/layout/CommandPalette.tsx')
    const content = fs.readFileSync(cmdkPath, 'utf-8')

    expect(content).toContain("import { Command } from 'cmdk'")
    expect(content).toContain("e.key === 'k'")
    expect(content).toContain('/cotizador')
    expect(content).toContain('/tienda')
    expect(content).toContain('getWhatsAppUrl')
  })

  it('TelemetryHUD expone métricas de Lighthouse 100, Core Web Vitals y lanzador de comandos', () => {
    const hudPath = path.resolve(process.cwd(), 'src/components/layout/TelemetryHUD.tsx')
    const content = fs.readFileSync(hudPath, 'utf-8')

    expect(content).toContain('Google Lighthouse')
    expect(content).toContain('100 / 100')
    expect(content).toContain('Core Web Vitals')
    expect(content).toContain('openCommandPalette')
  })

  it('OptimusGlyphSphere desactiva shadowBlur durante scroll para mantener 120 FPS', () => {
    const spherePath = path.resolve(process.cwd(), 'src/components/Hero/OptimusGlyphSphere.tsx')
    const content = fs.readFileSync(spherePath, 'utf-8')

    expect(content).toContain('isScrolling')
    expect(content).toContain('enableGlow = !isMobile && !isScrolling')
    expect(content).toContain('clearTimeout(scrollTimeout)')
  })

  it('PremiumBackground agrupa aristas de Delaunay en un único trazado y excluye cotizador', () => {
    const bgPath = path.resolve(process.cwd(), 'src/components/Effects/PremiumBackground.tsx')
    const content = fs.readFileSync(bgPath, 'utf-8')

    expect(content).toContain("!pathname?.startsWith('/cotizador')")
    expect(content).toContain('ctx.beginPath()')
    expect(content).toContain('ctx.stroke()')
  })
})

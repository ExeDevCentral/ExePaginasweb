/**
 * © 2025 Exequiel Echevarría — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 *
 * Tests de arquitectura profunda (Deep Modules) e interactividad de la página principal.
 */
import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'

describe('Landing Page — Deep Modules, Viewport Seam & Interactivity Audit', () => {
  it('app/page.tsx debe evitar montar simultáneamente MobileLandingView y DesktopLandingView tras hidratar el viewport', () => {
    const pagePath = path.resolve(process.cwd(), 'app/page.tsx')
    const content = fs.readFileSync(pagePath, 'utf-8')

    // Verifica que existe detección de viewport por matchMedia para desmontar el árbol inactivo
    expect(content).toContain('matchMedia')
    expect(content).toContain('(min-width: 768px)')
    expect(content).toContain('viewportMode')
  })

  it('OwnershipVsSubscription debe compactar la altura vertical en una estación interactiva dividida con ejes seleccionables y simulador BigInt', () => {
    const compPath = path.resolve(
      process.cwd(),
      'src/components/shared/OwnershipVsSubscription.tsx'
    )
    const content = fs.readFileSync(compPath, 'utf-8')

    // Estación de trabajo interactiva en doble columna para liberar scroll vertical
    expect(content).toContain('data-audit-workstation="true"')
    expect(content).toContain('selectedAxis')
    // Simulador de retención de capital con BigInt monetario estricto
    expect(content).toContain('data-capital-simulator="true"')
    expect(content).toContain('BigInt(')
  })

  it('InteractiveFeatureShowcase debe pausar su ciclo fuera del viewport (useInView) y soportar navegación interactiva por teclado', () => {
    const showcasePath = path.resolve(
      process.cwd(),
      'src/components/landing/InteractiveFeatureShowcase.tsx'
    )
    const content = fs.readFileSync(showcasePath, 'utf-8')

    expect(content).toContain('useInView')
    expect(content).toContain('useReducedMotion')
    expect(content).toContain("e.key === 'ArrowRight'")
    expect(content).toContain("e.key === 'ArrowLeft'")
  })

  it('HeroProductShowcase debe incluir simulador transaccional interactivo en 1 clic (data-live-simulator) dentro del monitor', () => {
    const heroShowcasePath = path.resolve(
      process.cwd(),
      'src/components/Hero/HeroProductShowcase.tsx'
    )
    const content = fs.readFileSync(heroShowcasePath, 'utf-8')

    expect(content).toContain('data-live-simulator="true"')
    expect(content).toContain('simulatedEvent')
    expect(content).toContain('triggerSimulation')
  })

  it('debe aplicar refinamiento gráfico de líneas finas (h-px, strokeWidth 1.5/2.5, p-px) y tipografía de alta definición (font-optical-sizing, geometricPrecision)', () => {
    const cssPath = path.resolve(process.cwd(), 'src/index.css')
    const cssContent = fs.readFileSync(cssPath, 'utf-8')
    expect(cssContent).toContain('font-optical-sizing: auto')
    expect(cssContent).toContain('geometricPrecision')

    const showcasePath = path.resolve(
      process.cwd(),
      'src/components/landing/InteractiveFeatureShowcase.tsx'
    )
    const showcaseContent = fs.readFileSync(showcasePath, 'utf-8')
    expect(showcaseContent).toContain('strokeWidth="2.5"')
    expect(showcaseContent).toContain('strokeWidth="1.5"')

    const heroShowcasePath = path.resolve(
      process.cwd(),
      'src/components/Hero/HeroProductShowcase.tsx'
    )
    const heroShowcaseContent = fs.readFileSync(heroShowcasePath, 'utf-8')
    expect(heroShowcaseContent).toContain('rounded-2xl p-px overflow-hidden')
  })
})

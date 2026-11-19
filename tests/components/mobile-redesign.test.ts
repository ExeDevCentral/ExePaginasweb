/**
 * © 2025 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 *
 * Auditoría automatizada de la arquitectura móvil (< 768px):
 * - Cero desborde horizontal en navbar
 * - Cero superposición de widgets flotantes sobre CTAs
 * - Planeta 3D preservado como protagonista en Hero móvil
 * - BigInt monetario estricto en cotizador y simulador de precios móvil
 * - Separación estricta mobile (< md) vs desktop (>= md) sin regresiones en escritorio
 * - Stacking context explícito (relative z-10) por encima de PremiumBackground
 */
import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'

const read = (rel: string) => fs.readFileSync(path.resolve(process.cwd(), rel), 'utf-8')

describe('Mobile Redesign (< 768px) — Ergonomía, Cero Overflow & BigInt', () => {
  it('MobileLandingView conserva el planeta 3D, elimina el 2025 duplicado y usa el WhatsApp oficial', () => {
    const content = read('src/components/landing/MobileLandingView.tsx')

    expect(content).toContain('OptimusGlyphSphere')
    expect(content).not.toContain('<Badge label="2025"')
    expect(content).not.toContain('5491124036054')
    expect(content).toContain('getWhatsAppUrl')
    expect(content).toContain('overflow-x-clip')
    expect(content).toContain('role="tablist"')
  })

  it('LiquidIslandNavbar evita desborde horizontal en celular ocultando MagneticCTA en < md', () => {
    const content = read('src/components/layout/LiquidIsland/LiquidIslandNavbar.tsx')

    expect(content).toMatch(/className="hidden md:block"[\s\S]*?<MagneticCTA/)
    expect(content).toContain('w-10 h-10')
  })

  it('DeferredChatWidget, AIChatWidget y BackToTopButton ocultan sus FABs en móvil para no tapar botones', () => {
    const deferred = read('src/components/chat/DeferredChatWidget.tsx')
    const chat = read('src/components/chat/AIChatWidget.tsx')
    const backToTop = read('src/components/layout/BackToTopButton.tsx')

    expect(deferred).toContain('hidden md:block')
    expect(deferred).toContain('exe:open-ai-chat')
    expect(chat).toContain('hidden md:block')
    expect(chat).toContain('exe:open-ai-chat')
    expect(backToTop).toContain('hidden md:block')
  })

  it('MobileBottomNav está acotado estrictamente a móvil (md:hidden) y conectado globalmente en providers', () => {
    const nav = read('src/components/mobile/MobileBottomNav.tsx')
    const providers = read('app/providers.tsx')

    expect(nav).toContain('md:hidden')
    expect(nav).toContain('data-mobile-bottom-nav="true"')
    expect(nav).toContain('exe:open-ai-chat')
    expect(providers).toContain('MobileBottomNav')
  })

  it('MobileQuoteView y MobilePricingView usan BigInt monetario estricto', () => {
    const quote = read('src/components/mobile/MobileQuoteView.tsx')
    const pricing = read('src/components/mobile/MobilePricingView.tsx')

    expect(quote).toContain('BigInt(')
    expect(quote).toContain('data-mobile-quote="true"')
    expect(pricing).toContain('BigInt(')
    expect(pricing).toContain('data-mobile-pricing="true"')
  })

  it('QuoteBuilder y las rutas públicas montan vistas móviles dedicadas sin alterar desktop (>= md)', () => {
    const quoteBuilder = read('src/components/QuoteBuilder/QuoteBuilder.tsx')
    const preciosPage = read('app/precios/page.tsx')
    const portafolioPage = read('app/portafolio/page.tsx')
    const solucionesPage = read('app/soluciones/page.tsx')
    const demosPage = read('app/demos/page.tsx')

    expect(quoteBuilder).toContain('SiteHeader')
    expect(quoteBuilder).toContain('MobileQuoteView')
    expect(quoteBuilder).toContain('block md:hidden')
    expect(quoteBuilder).toContain('hidden md:block')

    for (const pageContent of [preciosPage, portafolioPage, solucionesPage, demosPage]) {
      expect(pageContent).toContain('block md:hidden')
      expect(pageContent).toContain('hidden md:block')
    }
  })

  it('todas las vistas móviles establecen stacking context (relative z-10) por encima de PremiumBackground', () => {
    const mobileFiles = [
      'src/components/landing/MobileLandingView.tsx',
      'src/components/mobile/MobileQuoteView.tsx',
      'src/components/mobile/MobilePricingView.tsx',
      'src/components/mobile/MobilePortfolioView.tsx',
      'src/components/mobile/MobileSolutionsView.tsx',
      'src/components/mobile/MobileDemosView.tsx',
    ]

    for (const file of mobileFiles) {
      expect(read(file)).toContain('relative z-10')
    }
  })
})

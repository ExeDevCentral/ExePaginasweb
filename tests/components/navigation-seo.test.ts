import { describe, expect, it } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'

const read = (filePath: string) => fs.readFileSync(path.resolve(process.cwd(), filePath), 'utf-8')

describe('Cross-version navigation and SEO metadata', () => {
  it('routes shared contact links to the Classic contact section', () => {
    const footer = read('src/components/layout/Footer.tsx')
    const navbar = read('src/components/layout/LiquidIsland/LiquidIslandNavbar.tsx')
    const megaPanel = read('src/components/layout/LiquidIsland/MegaPanel.tsx')
    const productDemo = read('src/components/Products/ProductDemo.tsx')
    const scrollUtils = read('src/components/shared/scrollUtils.ts')

    expect(footer).toContain('href="/classic#contact"')
    expect(navbar).toContain('href="/classic#contact"')
    expect(megaPanel).toContain("href: '/classic#contact'")
    expect(productDemo).toContain('href="/classic#contact"')
    expect(navbar).toContain("if (pathname !== '/classic')")
    expect(scrollUtils).toContain("window.location.href = '/classic#' + cleanId")
    expect(footer).not.toContain('href="/#contact"')
    expect(navbar).not.toContain('href="/#contact"')
    expect(megaPanel).not.toContain("href: '/#contact'")
    expect(productDemo).not.toContain('href="#contact"')
  })

  it('provides a contact anchor in the Classic mobile closing section', () => {
    const mobileLanding = read('src/components/landing/MobileLandingView.tsx')
    const classicFace = read('src/faces/classic/ClassicFaceView.tsx')

    expect(mobileLanding).toContain('<section id="contact"')
    expect(classicFace).toContain("window.location.hash === '#contact'")
    expect(classicFace).toContain("document.getElementById('contact')?.scrollIntoView")
  })

  it('keeps the panel shortcut behind the dashboard login redirect', () => {
    const gateway = read('src/shared/GatewayScreen.tsx')
    const proxy = read('proxy.ts')

    expect(gateway).toContain('href="/dashboard"')
    expect(proxy).toContain("loginUrl.pathname = '/login'")
    expect(proxy).toContain('loginUrl.searchParams.set(')
    expect(proxy).toContain("matcher: ['/dashboard/:path*']")
  })

  it('includes the visible language code in the language switcher accessible name', () => {
    const languageSwitcher = read('src/components/layout/LanguageSwitcher.tsx')

    expect(languageSwitcher).toContain(
      "aria-label={`${t('nav.switch_language')}: ${currentLang.label}`}"
    )
  })

  it('includes the visible locale code in the gateway language menu accessible name', () => {
    const gateway = read('src/shared/GatewayScreen.tsx')

    expect(gateway).toContain(
      'aria-label={`${copy.languageMenuLabel}: ${activeLangOption.nativeName} (${activeLangOption.short})`}'
    )
  })

  it('declares canonical URLs for cotizador and tienda', () => {
    const quotePage = read('app/cotizador/page.tsx')
    const storePage = read('app/tienda/page.tsx')

    expect(quotePage).toContain("canonical: '/cotizador'")
    expect(storePage).toContain("canonical: '/tienda'")
  })

  it('prevents login and dashboard pages from being indexed', () => {
    const loginPage = read('app/login/page.tsx')
    const dashboardPage = read('app/dashboard/page.tsx')

    expect(loginPage).toMatch(/robots:\s*\{[^}]*index:\s*false/s)
    expect(dashboardPage).toMatch(/robots:\s*\{[^}]*index:\s*false/s)
    expect(loginPage).toContain("canonical: '/login'")
    expect(dashboardPage).toContain("canonical: '/dashboard'")
  })
})

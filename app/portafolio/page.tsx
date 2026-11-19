/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
import SiteHeader from '@/components/layout/SiteHeader'
import Footer from '@/components/layout/Footer'
import type { Metadata } from 'next'
import PortfolioSection from '@/components/Portfolio/PortfolioSection'
import MobilePortfolioView from '@/components/mobile/MobilePortfolioView'

export const metadata: Metadata = {
  title: 'Portafolio de Proyectos Web',
  description:
    'Conocé proyectos reales de Exe Paginas Web: SaaS, e-commerce, landings y aplicaciones web con código propio.',
  alternates: { canonical: '/portafolio' },
}

export default function PortafolioPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <div className="block md:hidden">
          <MobilePortfolioView />
        </div>
        <div className="hidden md:block pt-16">
          <PortfolioSection />
          <Footer />
        </div>
      </main>
    </>
  )
}

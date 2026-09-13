import SiteHeader from '@/components/layout/SiteHeader'
import type { Metadata } from 'next'
import PortfolioSection from '@/components/Portfolio/PortfolioSection'

export const metadata: Metadata = {
  title: 'Portafolio de Proyectos Web',
  description:
    'Conocé proyectos reales de Exe Paginas Web: SaaS, e-commerce, landings y aplicaciones web con código propio.',
  alternates: { canonical: '/portafolio' },
}

export default function PortafolioPage() {
  return <><SiteHeader /><main className="pt-16"><PortfolioSection /></main></>
}

/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
import dynamic from 'next/dynamic'
import type { Metadata } from 'next'
import SiteHeader from '@/components/layout/SiteHeader'
import Footer from '@/components/layout/Footer'
import Products from '@/components/Products/Products'
import MobileSolutionsView from '@/components/mobile/MobileSolutionsView'

export const metadata: Metadata = {
  title: 'Soluciones Web para Negocios',
  description:
    'Sistemas web a medida para peluquerías, panaderías, tiendas de indumentaria y canchas: turnos, pedidos, ventas y reservas.',
  alternates: { canonical: '/soluciones' },
}

const DemoZone = dynamic(() => import('@/components/DemoZone/DemoZone'), {
  loading: () => <PageLoading />,
})
const ContactSection = dynamic(() => import('@/components/landing/ContactSection'), {
  loading: () => <div className="h-40" />,
})

function PageLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center text-cyan-300">
      Cargando soluciones...
    </div>
  )
}

export default function SolucionesPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <div className="block md:hidden">
          <MobileSolutionsView />
        </div>
        <div className="hidden md:block pt-20">
          <Products />
          <DemoZone />
          <ContactSection />
          <Footer />
        </div>
      </main>
    </>
  )
}

import dynamic from 'next/dynamic'
import type { Metadata } from 'next'
import SiteHeader from '@/components/layout/SiteHeader'

export const metadata: Metadata = {
  title: 'Soluciones Web para Negocios',
  description:
    'Sistemas web a medida para peluquerías, panaderías, tiendas de indumentaria y canchas: turnos, pedidos, ventas y reservas.',
  alternates: { canonical: '/soluciones' },
}

const Products = dynamic(() => import('@/components/Products/Products'), { loading: () => <PageLoading /> })

function PageLoading() {
  return <div className="flex min-h-screen items-center justify-center text-cyan-300">Cargando soluciones...</div>
}

export default function SolucionesPage() {
  return <><SiteHeader /><main className="pt-20"><Products /></main></>
}

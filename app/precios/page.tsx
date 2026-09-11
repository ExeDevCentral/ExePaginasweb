import dynamic from 'next/dynamic'
import type { Metadata } from 'next'
import SiteHeader from '@/components/layout/SiteHeader'

export const metadata: Metadata = {
  title: 'Precios y Planes de Desarrollo Web',
  description:
    'Consultá planes de desarrollo web y calculá el retorno de inversión de tu próximo sistema a medida.',
  alternates: { canonical: '/precios' },
}

const Pricing = dynamic(() => import('@/components/Pricing/Pricing'), { loading: () => <div className="flex min-h-screen items-center justify-center text-cyan-300">Cargando planes...</div> })

export default function PreciosPage() {
  return <><SiteHeader /><main className="pt-16"><Pricing /></main></>
}

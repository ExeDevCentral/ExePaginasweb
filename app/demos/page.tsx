import dynamic from 'next/dynamic'
import type { Metadata } from 'next'
import SiteHeader from '@/components/layout/SiteHeader'

export const metadata: Metadata = {
  title: 'Demos Interactivas',
  description:
    'Explorá demos interactivas de sitios para salones, gimnasios, inmobiliarias y cafeterías creadas por Exe Paginas Web.',
  alternates: { canonical: '/demos' },
}

const DemoZone = dynamic(() => import('@/components/DemoZone/DemoZone'), { loading: () => <div className="flex min-h-screen items-center justify-center text-cyan-300">Cargando demos...</div> })

export default function DemosPage() {
  return <><SiteHeader /><main className="pt-16"><DemoZone /></main></>
}

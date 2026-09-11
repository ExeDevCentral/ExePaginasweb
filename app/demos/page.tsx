'use client'

import dynamic from 'next/dynamic'
import SiteHeader from '@/components/layout/SiteHeader'

const DemoZone = dynamic(() => import('@/components/DemoZone/DemoZone'), { ssr: false, loading: () => <div className="flex min-h-screen items-center justify-center text-cyan-300">Cargando demos...</div> })

export default function DemosPage() {
  return <><SiteHeader /><main className="pt-16"><DemoZone /></main></>
}

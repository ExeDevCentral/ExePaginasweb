'use client'

import dynamic from 'next/dynamic'
import SiteHeader from '@/components/layout/SiteHeader'

const Pricing = dynamic(() => import('@/components/Pricing/Pricing'), { loading: () => <div className="flex min-h-screen items-center justify-center text-cyan-300">Cargando planes...</div> })

export default function PreciosPage() {
  return <><SiteHeader /><main className="pt-16"><Pricing /></main></>
}

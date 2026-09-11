'use client'

import dynamic from 'next/dynamic'
import SiteHeader from '@/components/layout/SiteHeader'

const Products = dynamic(() => import('@/components/Products/Products'), { loading: () => <PageLoading /> })

function PageLoading() {
  return <div className="flex min-h-screen items-center justify-center text-cyan-300">Cargando soluciones...</div>
}

export default function SolucionesPage() {
  return <><SiteHeader /><main className="pt-20"><Products /></main></>
}

'use client'

import dynamic from 'next/dynamic'
import Header from '@/components/layout/Header'

const Products = dynamic(() => import('@/components/Products/Products'), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-screen items-center justify-center text-cyan-300">
      Cargando soluciones...
    </div>
  ),
})

export default function SolutionsPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        <Products />
      </main>
    </>
  )
}

/**
 * Ejemplo: Landing page con code splitting de Three.js
 *
 * ✅ Aurora solo carga cuando es visible
 * ✅ Hero renderiza sin esperar 3D
 * ✅ Fallback skeleton mientras carga
 *
 * NOTA: Este es un archivo de ejemplo (.example.tsx)
 * Para usar, renombra a page.tsx o integra en tu landing actual
 */

'use client'

import { useRef } from 'react'
import dynamic from 'next/dynamic'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'

// Lazy load componentes 3D costosos
const Aurora = dynamic(() => import('@/components/Effects/Aurora'), {
  ssr: false,
  loading: () => (
    <div className="h-96 bg-gradient-to-b from-slate-900 via-slate-800 to-black animate-pulse" />
  ),
})

const CoffeePortal = dynamic(() => import('@/components/Effects/CoffeePortal'), {
  ssr: false,
  loading: () => <div className="h-96 bg-gradient-to-b from-indigo-900 to-black animate-pulse" />,
})

const HeroComparator = dynamic(() => import('@/components/Hero/Comparator'), {
  ssr: true, // SSR seguro, no depende de canvas
  loading: () => <div className="h-40 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />,
})

export default function LandingPageExample() {
  const auroraRef = useRef<HTMLDivElement>(null)
  const coffeeRef = useRef<HTMLDivElement>(null)

  // Solo renderiza cuando visible en viewport
  const showAurora = useIntersectionObserver(auroraRef, { threshold: 0.1 })
  const showCoffee = useIntersectionObserver(coffeeRef, { threshold: 0.1 })

  return (
    <>
      {/* Hero — Renderiza inmediatamente */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 -z-10" />

        <div className="container mx-auto px-4 py-20 z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
              Plataforma SaaS
              <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                {' '}
                Empresarial
              </span>
            </h1>

            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Automatiza reservas, tickets, facturación y SLA en una sola plataforma.
            </p>

            {/* HeroComparator renderiza sin bloquear */}
            <HeroComparator />

            <div className="flex gap-4 justify-center pt-8">
              <button className="px-8 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-semibold transition">
                Comenzar Gratis
              </button>
              <button className="px-8 py-3 border border-slate-500 text-white rounded-lg font-semibold hover:bg-slate-800 transition">
                Ver Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Aurora — Lazy load cuando es visible */}
      <section
        ref={auroraRef}
        className="relative min-h-screen flex items-center justify-center bg-black"
      >
        {showAurora && <Aurora />}
        <div className="relative z-10 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Experiencia Visual Premium</h2>
          <p className="text-slate-300 text-lg">Interfaz 3D interactiva con animaciones fluidas</p>
        </div>
      </section>

      {/* Características en grid */}
      <section className="py-20 bg-slate-900">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-white text-center mb-16">
            Características Principales
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '⚙️',
                title: 'Automatización',
                desc: 'Workflows automáticos y triggers',
              },
              {
                icon: '📊',
                title: 'Analytics',
                desc: 'Dashboards y reportes en tiempo real',
              },
              {
                icon: '🔒',
                title: 'Seguridad',
                desc: 'RLS, encriptación, audit logs',
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="p-6 bg-slate-800 rounded-lg border border-slate-700 hover:border-cyan-500 transition"
              >
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coffee Portal — Lazy load cuando es visible */}
      <section ref={coffeeRef} className="relative min-h-screen flex items-center justify-center">
        <div className="absolute inset-0 bg-slate-950 -z-10" />
        {showCoffee && <CoffeePortal />}
        <div className="relative z-10 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Diseño Interactivo</h2>
          <p className="text-slate-300 text-lg">Experimenta la magia del diseño tridimensional</p>
        </div>
      </section>

      {/* Pricing - Con imágenes optimizadas */}
      <section className="py-20 bg-slate-900">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-white text-center mb-16">Planes y Precios</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { name: 'Starter', price: '$99/mo', features: ['Up to 5 users', '1GB storage'] },
              {
                name: 'Professional',
                price: '$299/mo',
                featured: true,
                features: ['Up to 50 users', '100GB storage', 'Advanced analytics'],
              },
              {
                name: 'Enterprise',
                price: 'Custom',
                features: ['Unlimited users', 'Custom storage', 'Dedicated support'],
              },
            ].map((plan, i) => (
              <div
                key={i}
                className={`p-8 rounded-lg border-2 transition ${
                  plan.featured
                    ? 'border-cyan-500 bg-slate-800'
                    : 'border-slate-700 bg-slate-900 hover:border-slate-600'
                }`}
              >
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-3xl font-bold text-cyan-400 mb-6">{plan.price}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feat, j) => (
                    <li key={j} className="text-slate-300 flex items-center gap-2">
                      ✓ {feat}
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-2 rounded font-semibold transition ${
                    plan.featured
                      ? 'bg-cyan-500 hover:bg-cyan-600 text-white'
                      : 'border border-slate-600 text-white hover:bg-slate-800'
                  }`}
                >
                  Seleccionar
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
